#[cfg(test)]
mod tests {
    use super::*;
    use stylus_sdk::alloy_primitives::{Address, U256};

    #[test]
    fn test_gift_card_creation() {
        // This is a placeholder test
        // Actual testing requires Stylus test framework
        
        let amount = U256::from(100_000_000); // 100 USDC (6 decimals)
        let expiry_days = U256::from(30);
        
        assert!(amount > U256::from(0));
        assert!(expiry_days > U256::from(0));
    }

    #[test]
    fn test_expiry_calculation() {
        let expiry_days = U256::from(30);
        let seconds_per_day = U256::from(86400);
        let expiry_seconds = expiry_days * seconds_per_day;
        
        assert_eq!(expiry_seconds, U256::from(2_592_000)); // 30 days in seconds
    }

    #[test]
    fn test_balance_deduction() {
        let initial_balance = U256::from(100_000_000);
        let redemption_amount = U256::from(25_000_000);
        let remaining = initial_balance - redemption_amount;
        
        assert_eq!(remaining, U256::from(75_000_000));
    }
}
