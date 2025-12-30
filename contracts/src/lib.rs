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
        string message
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

    event MerchantAdded(
        uint256 indexed giftCardId,
        string merchantName
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
    
    /// Mapping from gift card ID to allowed merchants (stored as indices)
    allowed_merchants: StorageMap<U256, StorageVec<StorageU256>>,
    
    /// Mapping from merchant index to merchant name
    merchant_names: StorageMap<U256, String>,
    
    /// Merchant counter
    merchant_counter: StorageU256,
    
    /// Mapping from gift card ID to custom message
    gift_card_messages: StorageMap<U256, String>,
    
    /// USDC token address (ERC20)
    usdc_token: StorageAddress,
    
    /// Paused state
    paused: StorageBool,
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
    MerchantNotAllowed,
    MessageTooLong,
}

#[public]
impl FlexiGiftContract {
    /// Initialize the contract
    pub fn initialize(&mut self, usdc_address: Address) -> Result<(), FlexiGiftError> {
        self.owner.set(msg::sender());
        self.usdc_token.set(usdc_address);
        self.gift_card_counter.set(U256::from(0));
        self.merchant_counter.set(U256::from(0));
        self.paused.set(false);
        Ok(())
    }

    /// Create a new gift card
    /// @param amount: Amount of USDC to lock
    /// @param expiry_days: Number of days until expiry
    /// @param merchant_indices: Array of allowed merchant indices
    /// @param message: Optional custom message (max 280 characters)
    pub fn create_gift_card(
        &mut self,
        amount: U256,
        expiry_days: U256,
        merchant_indices: Vec<U256>,
        message: String,
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

        // Calculate expiry timestamp
        let current_time = U256::from(block::timestamp());
        let expiry_seconds = expiry_days * U256::from(86400); // days to seconds
        let expiry_timestamp = current_time + expiry_seconds;

        // Increment counter
        let gift_card_id = self.gift_card_counter.get() + U256::from(1);
        self.gift_card_counter.set(gift_card_id);

        // Create gift card
        let gift_card = GiftCard {
            id: gift_card_id,
            giver: msg::sender(),
            amount,
            remaining_balance: amount,
            expiry_timestamp,
            is_active: true,
            created_at: current_time,
            message: message.clone(),
        };

        // Store gift card
        self.gift_cards.insert(gift_card_id, gift_card);

        // Store message separately for efficient access
        self.gift_card_messages.insert(gift_card_id, message.clone());

        // Store allowed merchants
        let mut merchants = self.allowed_merchants.get_mut(gift_card_id);
        for merchant_idx in merchant_indices {
            merchants.push(StorageU256::new(merchant_idx));
        }

        // TODO: Transfer USDC from sender to contract
        // This requires ERC20 interface implementation

        // Emit event
        evm::log(GiftCardCreated {
            giftCardId: gift_card_id,
            giver: msg::sender(),
            amount,
            expiryTimestamp: expiry_timestamp,
            message,
        });

        Ok(gift_card_id)
    }

    /// Redeem a gift card
    /// @param gift_card_id: ID of the gift card
    /// @param amount: Amount to redeem
    /// @param merchant_index: Index of the merchant
    pub fn redeem_gift_card(
        &mut self,
        gift_card_id: U256,
        amount: U256,
        merchant_index: U256,
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

        // Check if expired
        let current_time = U256::from(block::timestamp());
        if current_time > gift_card.expiry_timestamp {
            return Err(FlexiGiftError::GiftCardExpired);
        }

        // Check balance
        if amount > gift_card.remaining_balance {
            return Err(FlexiGiftError::InsufficientBalance);
        }

        // Check if merchant is allowed
        let merchants = self.allowed_merchants.get(gift_card_id);
        let mut merchant_allowed = false;
        for i in 0..merchants.len() {
            if merchants.get(i).unwrap().get() == merchant_index {
                merchant_allowed = true;
                break;
            }
        }
        if !merchant_allowed {
            return Err(FlexiGiftError::MerchantNotAllowed);
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

        // Only giver can refund
        if msg::sender() != gift_card.giver {
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

    /// Add a merchant to the registry
    pub fn add_merchant(&mut self, name: String) -> Result<U256, FlexiGiftError> {
        // Only owner can add merchants
        if msg::sender() != self.owner.get() {
            return Err(FlexiGiftError::Unauthorized);
        }

        let merchant_id = self.merchant_counter.get() + U256::from(1);
        self.merchant_counter.set(merchant_id);
        self.merchant_names.insert(merchant_id, name.clone());

        Ok(merchant_id)
    }

    /// Get merchant name
    pub fn get_merchant_name(&self, merchant_id: U256) -> Option<String> {
        self.merchant_names.get(merchant_id)
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
}
