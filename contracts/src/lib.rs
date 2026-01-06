use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::sol,
    prelude::*,
    storage::{StorageAddress, StorageU256, StorageVec, StorageMap, StorageBool},
    block, msg,
};

// Solidity-compatible types for events and external calls
sol! {
    event GiftCardCreated(
        uint256 indexed giftCardId,
        address indexed giver,
        uint256 amount,
        uint256 expiryTimestamp,
        string message,
        uint256 deliveryTimestamp
    );

    event GiftCardRedeemed(
        uint256 indexed giftCardId,
        address indexed recipient,
        uint256 amount,
        uint256 remainingBalance
    );

    event GiftCardRefunded(
        uint256 indexed giftCardId,
        address indexed giver,
        uint256 refundAmount
    );

    event GiftCardDelivered(
        uint256 indexed giftCardId,
        uint256 deliveredAt
    );

    event ScheduledDeliveryCancelled(
        uint256 indexed giftCardId,
        address indexed giver
    );

    // ERC-721 Events
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // Marketplace Events
    event GiftCardListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event GiftCardSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller
    );
}

/// Represents a single gift card
#[derive(SolidityStruct)]
pub struct GiftCard {
    pub id: U256,
    pub giver: Address,
    pub amount: U256,
    pub remaining_balance: U256,
    pub expiry_timestamp: U256,
    pub is_active: bool,
    pub created_at: U256,
    pub message: String,
    pub delivery_timestamp: U256,  // 0 = immediate, >0 = scheduled
    pub is_delivered: bool,         // false until delivery time
}

/// Represents a marketplace listing
#[derive(SolidityStruct)]
pub struct Listing {
    pub token_id: U256,
    pub seller: Address,
    pub price: U256,
    pub is_active: bool,
}

/// Main FlexiGift contract storage
#[storage]
#[entrypoint]
pub struct FlexiGiftContract {
    /// Owner of the contract
    owner: StorageAddress,
    
    /// Counter for gift card IDs
    gift_card_counter: StorageU256,
    
    /// Mapping from gift card ID to GiftCard struct
    gift_cards: StorageMap<U256, GiftCard>,

    /// Pause state
    paused: StorageBool,
    
    /// Address of back-end USDC token
    usdc_token: StorageAddress,

    /// Mapping from gift card ID to message
    gift_card_messages: StorageMap<U256, String>,

    // --- NFT (ERC-721) Storage ---
    /// Metadata Base URI
    nft_base_uri: StorageMap<U256, String>, // Using a map for token-specific URIs if needed

    /// Mapping from token ID to owner
    token_owners: StorageMap<U256, StorageAddress>,

    /// Mapping from owner to balance
    token_balances: StorageMap<Address, StorageU256>,

    /// Mapping from token ID to approved address
    token_approvals: StorageMap<U256, StorageAddress>,

    /// Mapping from owner to operator approvals
    operator_approvals: StorageMap<Address, StorageMap<Address, StorageBool>>,

    // --- Marketplace Storage ---
    /// Mapping from token ID to Listing
    listings: StorageMap<U256, Listing>,
}

/// Errors
pub enum FlexiGiftError {
    Unauthorized,
    InvalidAmount,
    InvalidExpiry,
    GiftCardNotFound,
    GiftCardExpired,
    GiftCardInactive,
    InsufficientBalance,
    TransferFailed,
    Paused,
    MessageTooLong,
    NotYetDelivered,
    AlreadyDelivered,
    DeliveryTimeNotReached,
    OnlyGiverCanCancel,
    CannotCancelAfterDelivery,
    InvalidDeliveryTime,
}

#[public]
impl FlexiGiftContract {
    /// Initialize the contract
    pub fn initialize(&mut self, usdc_address: Address) -> Result<(), FlexiGiftError> {
        self.owner.set(msg::sender());
        self.usdc_token.set(usdc_address);
        self.gift_card_counter.set(U256::from(0));
        self.paused.set(false);
        Ok(())
    }

    /// Create a new gift card
    /// @param amount: Amount of USDC to lock
    /// @param expiry_days: Number of days until expiry
    /// @param message: Optional custom message (max 280 characters)
    /// @param delivery_timestamp: Unix timestamp for delivery (0 = immediate)
    pub fn create_gift_card(
        &mut self,
        amount: U256,
        expiry_days: U256,
        message: String,
        delivery_timestamp: U256,
    ) -> Result<U256, FlexiGiftError> {
        // Check if paused
        if self.paused.get() {
            return Err(FlexiGiftError::Paused);
        }

        // Validate amount
        if amount == U256::from(0) {
            return Err(FlexiGiftError::InvalidAmount);
        }

        // Validate expiry
        if expiry_days == U256::from(0) {
            return Err(FlexiGiftError::InvalidExpiry);
        }

        // Validate message length (max 280 characters for security)
        if message.len() > 280 {
            return Err(FlexiGiftError::MessageTooLong);
        }

        // Validate delivery timestamp
        let current_time = U256::from(block::timestamp());
        if delivery_timestamp != U256::from(0) {
            // If scheduled delivery, must be in future
            if delivery_timestamp <= current_time {
                return Err(FlexiGiftError::InvalidDeliveryTime);
            }
            // Delivery must be before expiry
            let expiry_seconds = expiry_days * U256::from(86400);
            let expiry_timestamp = current_time + expiry_seconds;
            if delivery_timestamp >= expiry_timestamp {
                return Err(FlexiGiftError::InvalidDeliveryTime);
            }
        }

        // Calculate expiry timestamp
        let expiry_seconds = expiry_days * U256::from(86400); // days to seconds
        let expiry_timestamp = current_time + expiry_seconds;

        // Increment counter
        let gift_card_id = self.gift_card_counter.get() + U256::from(1);
        self.gift_card_counter.set(gift_card_id);

        // Create gift card
        let is_immediate = delivery_timestamp == U256::from(0);
        let gift_card = GiftCard {
            id: gift_card_id,
            giver: msg::sender(),
            amount,
            remaining_balance: amount,
            expiry_timestamp,
            is_active: true,
            created_at: current_time,
            message: message.clone(),
            delivery_timestamp,
            is_delivered: is_immediate,  // Immediate delivery = already delivered
        };

        // Store gift card
        self.gift_cards.insert(gift_card_id, gift_card);

        // Store message separately for efficient access
        self.gift_card_messages.insert(gift_card_id, message.clone());

        // TODO: Transfer USDC from sender to contract
        // This requires ERC20 interface implementation

        // Emit event
        evm::log(GiftCardCreated {
            giftCardId: gift_card_id,
            giver: msg::sender(),
            amount,
            expiryTimestamp: expiry_timestamp,
            message,
            deliveryTimestamp: delivery_timestamp,
        });

        // --- Mint NFT ---
        self.token_owners.insert(gift_card_id, msg::sender());
        let balance = self.token_balances.get(msg::sender());
        self.token_balances.insert(msg::sender(), balance + U256::from(1));

        // Log Transfer event (ERC-721)
        evm::log(Transfer {
            from: Address::ZERO,
            to: msg::sender(),
            tokenId: gift_card_id,
        });

        Ok(gift_card_id)
    }

    /// Redeem a gift card
    /// @param gift_card_id: ID of the gift card
    /// @param amount: Amount to redeem
    pub fn redeem_gift_card(
        &mut self,
        gift_card_id: U256,
        amount: U256,
    ) -> Result<(), FlexiGiftError> {
        // Check if paused
        if self.paused.get() {
            return Err(FlexiGiftError::Paused);
        }

        // Get gift card
        let mut gift_card = self.gift_cards.get(gift_card_id)
            .ok_or(FlexiGiftError::GiftCardNotFound)?;

        // Check if active
        if !gift_card.is_active {
            return Err(FlexiGiftError::GiftCardInactive);
        }

        // Check if delivered (for scheduled gifts)
        if !gift_card.is_delivered {
            return Err(FlexiGiftError::NotYetDelivered);
        }

        // Check if expired
        let current_time = U256::from(block::timestamp());
        if current_time > gift_card.expiry_timestamp {
            return Err(FlexiGiftError::GiftCardExpired);
        }

        // Check balance
        if amount > gift_card.remaining_balance {
            return Err(FlexiGiftError::InsufficientBalance);
        }

        // Update balance
        gift_card.remaining_balance -= amount;
        
        // If balance is zero, deactivate
        if gift_card.remaining_balance == U256::from(0) {
            gift_card.is_active = false;
        }

        // Update storage
        self.gift_cards.insert(gift_card_id, gift_card);

        // TODO: Transfer USDC to recipient
        // This requires ERC20 interface implementation

        // Emit event
        evm::log(GiftCardRedeemed {
            giftCardId: gift_card_id,
            recipient: msg::sender(),
            amount,
            remainingBalance: gift_card.remaining_balance,
        });

        Ok(())
    }

    /// Refund unused balance after expiry
    /// @param gift_card_id: ID of the gift card
    pub fn refund_gift_card(&mut self, gift_card_id: U256) -> Result<(), FlexiGiftError> {
        // Get gift card
        let mut gift_card = self.gift_cards.get(gift_card_id)
            .ok_or(FlexiGiftError::GiftCardNotFound)?;

        // Only current owner can refund
        let current_owner = self.owner_of(gift_card_id);
        if msg::sender() != current_owner {
            return Err(FlexiGiftError::Unauthorized);
        }

        // Check if expired
        let current_time = U256::from(block::timestamp());
        if current_time <= gift_card.expiry_timestamp {
            return Err(FlexiGiftError::InvalidExpiry);
        }

        // Get refund amount
        let refund_amount = gift_card.remaining_balance;

        // Deactivate card
        gift_card.is_active = false;
        gift_card.remaining_balance = U256::from(0);
        self.gift_cards.insert(gift_card_id, gift_card);

        // TODO: Transfer USDC back to giver
        // This requires ERC20 interface implementation

        // Emit event
        evm::log(GiftCardRefunded {
            giftCardId: gift_card_id,
            giver: gift_card.giver,
            refundAmount: refund_amount,
        });

        Ok(())
    }

    /// Get gift card details
    pub fn get_gift_card(&self, gift_card_id: U256) -> Result<GiftCard, FlexiGiftError> {
        self.gift_cards.get(gift_card_id)
            .ok_or(FlexiGiftError::GiftCardNotFound)
    }

    // --- ERC-721 Implementation ---

    /// Returns the NFT name
    pub fn name(&self) -> String {
        "FlexiGift Card".to_string()
    }

    /// Returns the NFT symbol
    pub fn symbol(&self) -> String {
        "FGIFT".to_string()
    }

    /// Returns the owner of the tokenId
    pub fn owner_of(&self, token_id: U256) -> Address {
        self.token_owners.get(token_id)
    }

    /// Returns the number of tokens owned by address
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.token_balances.get(owner)
    }

    /// Returns the Approved address for a token
    pub fn get_approved(&self, token_id: U256) -> Address {
        self.token_approvals.get(token_id)
    }

    /// Returns if operator is approved for owner
    pub fn is_approved_for_all(&self, owner: Address, operator: Address) -> bool {
        self.operator_approvals.get(owner).get(operator)
    }

    /// Approve an address to transfer a token
    pub fn approve(&mut self, to: Address, token_id: U256) -> Result<(), FlexiGiftError> {
        let owner = self.owner_of(token_id);
        if msg::sender() != owner && !self.is_approved_for_all(owner, msg::sender()) {
            return Err(FlexiGiftError::Unauthorized);
        }
        self.token_approvals.insert(token_id, to);
        evm::log(Approval { owner, approved: to, tokenId: token_id });
        Ok(())
    }

    /// Set approval for all for an operator
    pub fn set_approval_for_all(&mut self, operator: Address, approved: bool) -> Result<(), FlexiGiftError> {
        let mut owner_approvals = self.operator_approvals.get_mut(msg::sender());
        owner_approvals.insert(operator, approved);
        evm::log(ApprovalForAll { owner: msg::sender(), operator, approved });
        Ok(())
    }

    /// Transfer a token from one address to another
    pub fn transfer_from(&mut self, from: Address, to: Address, token_id: U256) -> Result<(), FlexiGiftError> {
        let owner = self.owner_of(token_id);
        if msg::sender() != owner && 
           self.get_approved(token_id) != msg::sender() && 
           !self.is_approved_for_all(owner, msg::sender()) 
        {
            return Err(FlexiGiftError::Unauthorized);
        }

        if owner != from {
            return Err(FlexiGiftError::Unauthorized);
        }

        // Update ownership
        self.token_owners.insert(token_id, to);
        
        // Update balances
        let from_balance = self.token_balances.get(from);
        let to_balance = self.token_balances.get(to);
        self.token_balances.insert(from, from_balance - U256::from(1));
        self.token_balances.insert(to, to_balance + U256::from(1));

        // Clear approval
        self.token_approvals.insert(token_id, Address::ZERO);

        evm::log(Transfer { from, to, tokenId: token_id });

        Ok(())
    }

    /// Safe transfer (simplified for MVP)
    pub fn safe_transfer_from(&mut self, from: Address, to: Address, token_id: U256) -> Result<(), FlexiGiftError> {
        self.transfer_from(from, to, token_id)
    }

    /// Returns the metadata URI for a token
    pub fn token_uri(&self, token_id: U256) -> String {
        // Here we build a dynamic URI that the frontend can use to generate the SVG
        // For a hackathon, we can use a base API that fetches data from the contract
        let base = self.nft_base_uri.get(token_id);
        if base.is_empty() {
             // Fallback to a default generator if no specific URI set
             format!("https://api.flexigift.xyz/metadata/{}", token_id)
        } else {
            base
        }
    }

    /// Set a custom base URI for a token (only giver/owner)
    pub fn set_token_uri(&mut self, token_id: U256, uri: String) -> Result<(), FlexiGiftError> {
        let owner = self.owner_of(token_id);
        if msg::sender() != owner {
            return Err(FlexiGiftError::Unauthorized);
        }
        self.nft_base_uri.insert(token_id, uri);
        Ok(())
    }

    /// Pause contract (owner only)
    pub fn pause(&mut self) -> Result<(), FlexiGiftError> {
        if msg::sender() != self.owner.get() {
            return Err(FlexiGiftError::Unauthorized);
        }
        self.paused.set(true);
        Ok(())
    }

    /// Unpause contract (owner only)
    pub fn unpause(&mut self) -> Result<(), FlexiGiftError> {
        if msg::sender() != self.owner.get() {
            return Err(FlexiGiftError::Unauthorized);
        }
        self.paused.set(false);
        Ok(())
    }

    /// Deliver a scheduled gift card (callable by anyone after delivery time)
    pub fn deliver_gift_card(&mut self, gift_card_id: U256) -> Result<(), FlexiGiftError> {
        // Get gift card
        let mut gift_card = self.gift_cards.get(gift_card_id)
            .ok_or(FlexiGiftError::GiftCardNotFound)?;

        // Check if already delivered
        if gift_card.is_delivered {
            return Err(FlexiGiftError::AlreadyDelivered);
        }

        // Check if delivery time has arrived
        let current_time = U256::from(block::timestamp());
        if current_time < gift_card.delivery_timestamp {
            return Err(FlexiGiftError::DeliveryTimeNotReached);
        }

        // Mark as delivered
        gift_card.is_delivered = true;
        self.gift_cards.insert(gift_card_id, gift_card);

        // Emit event
        evm::log(GiftCardDelivered {
            giftCardId: gift_card_id,
            deliveredAt: current_time,
        });

        Ok(())
    }

    /// Cancel scheduled delivery (only current owner, before delivery)
    pub fn cancel_scheduled_delivery(&mut self, gift_card_id: U256) -> Result<(), FlexiGiftError> {
        // Get gift card
        let mut gift_card = self.gift_cards.get(gift_card_id)
            .ok_or(FlexiGiftError::GiftCardNotFound)?;

        // Only current owner can cancel
        let current_owner = self.owner_of(gift_card_id);
        if msg::sender() != current_owner {
            return Err(FlexiGiftError::OnlyGiverCanCancel);
        }

        // Cannot cancel after delivery
        if gift_card.is_delivered {
            return Err(FlexiGiftError::CannotCancelAfterDelivery);
        }

        // Get refund amount
        let refund_amount = gift_card.remaining_balance;

        // Deactivate card
        gift_card.is_active = false;
        gift_card.remaining_balance = U256::from(0);
        self.gift_cards.insert(gift_card_id, gift_card);

        // TODO: Transfer USDC back to giver
        // This requires ERC20 interface implementation

        // Emit event
        evm::log(ScheduledDeliveryCancelled {
            giftCardId: gift_card_id,
            giver: gift_card.giver,
        });

        Ok(())
    }

    // --- Marketplace Implementation ---

    /// List a gift card for sale
    pub fn list_gift_card(&mut self, token_id: U256, price: U256) -> Result<(), FlexiGiftError> {
        let owner = self.owner_of(token_id);
        if msg::sender() != owner {
            return Err(FlexiGiftError::Unauthorized);
        }

        if price == U256::from(0) {
            return Err(FlexiGiftError::InvalidAmount);
        }

        let listing = Listing {
            token_id,
            seller: msg::sender(),
            price,
            is_active: true,
        };

        self.listings.insert(token_id, listing);

        evm::log(GiftCardListed {
            tokenId: token_id,
            seller: msg::sender(),
            price,
        });

        Ok(())
    }

    /// Buy a listed gift card
    pub fn buy_gift_card(&mut self, token_id: U256) -> Result<(), FlexiGiftError> {
        let mut listing = self.listings.get(token_id);
        if !listing.is_active {
             return Err(FlexiGiftError::GiftCardNotFound); // Or specific Marketplace error
        }

        let seller = listing.seller;
        let price = listing.price;
        let buyer = msg::sender();

        if buyer == seller {
            return Err(FlexiGiftError::Unauthorized); // Cannot buy own listing
        }

        // TODO: Transfer USDC from buyer to seller
        // This requires ERC20 interface implementation

        // Transfer NFT ownership
        self.token_owners.insert(token_id, buyer);
        
        // Update balances
        let seller_balance = self.token_balances.get(seller);
        let buyer_balance = self.token_balances.get(buyer);
        self.token_balances.insert(seller, seller_balance - U256::from(1));
        self.token_balances.insert(buyer, buyer_balance + U256::from(1));

        // Mark listing as inactive
        listing.is_active = false;
        self.listings.insert(token_id, listing);

        // Clear approval
        self.token_approvals.insert(token_id, Address::ZERO);

        evm::log(GiftCardSold {
            tokenId: token_id,
            seller,
            buyer,
            price,
        });

        evm::log(Transfer {
            from: seller,
            to: buyer,
            tokenId: token_id,
        });

        Ok(())
    }

    /// Cancel a listing
    pub fn cancel_listing(&mut self, token_id: U256) -> Result<(), FlexiGiftError> {
        let mut listing = self.listings.get(token_id);
        if !listing.is_active {
            return Err(FlexiGiftError::GiftCardNotFound);
        }

        if msg::sender() != listing.seller {
            return Err(FlexiGiftError::Unauthorized);
        }

        listing.is_active = false;
        self.listings.insert(token_id, listing);

        evm::log(ListingCancelled {
            tokenId: token_id,
            seller: msg::sender(),
        });

        Ok(())
    }

    /// Get listing details
    pub fn get_listing(&self, token_id: U256) -> (U256, Address, U256, bool) {
        let listing = self.listings.get(token_id);
        (listing.token_id, listing.seller, listing.price, listing.is_active)
    }
}
