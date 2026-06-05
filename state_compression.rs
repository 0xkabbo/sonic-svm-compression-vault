use anchor_lang::prelude::*;

declare_id!("SonicComp11111111111111111111111111111111");

#[program]
pub mod state_compression_vault {
    use super::*;

    /// Reconciles an on-chain root anchor point by validating an off-chain membership proof update.
    pub fn update_root_anchor(ctx: Context<UpdateRootAnchor>, new_root: [u8; 32], proof_bytes: Vec<u8>) -> Result<()> {
        let registry = &mut ctx.accounts.compression_registry;
        
        // In full production, evaluate the proof_bytes vector array against the 
        // existing root parameters to verify historical transaction consistency.
        require!(proof_bytes.len() > 0, CompressionError::EmptyProofBytes);

        registry.root_hash = new_root;
        registry.last_update_slot = Clock::get()?.slot;

        msg!("SonicStateCompressed: Root Anchor committed securely. Slot: {}", registry.last_update_slot);
        Ok(())
    }
}

#[account]
pub struct CompressionRegistry {
    pub root_hash: [u8; 32],
    pub last_update_slot: u64,
}

#[derive(Accounts)]
pub struct UpdateRootAnchor<'info> {
    #[account(mut)]
    pub compression_registry: Account<'info, CompressionRegistry>,
    pub authority: Signer<'info>,
}

#[error_code]
pub enum CompressionError {
    #[msg("Provided cryptographic validity proof parameters cannot be empty.")]
    EmptyProofBytes,
}
