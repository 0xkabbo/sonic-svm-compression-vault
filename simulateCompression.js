const crypto = require('crypto');

class SonicCompressionIndexer {
    constructor() {
        this.leaves = [];
        this.currentMerkleRoot = crypto.createHash('sha256').update('COMPRESSION_GENESIS').digest('hex');
    }

    /**
     * Hashes and packs raw user account attributes into the local tree array.
     * @param {string} accountId Public Key string representation.
     * @param {object} accountData Dynamic state properties.
     */
    compressAccountState(accountId, accountData) {
        console.log(`[Compression Indexer] Compressing state structures for: ${accountId}`);
        
        const rawSerializedPayload = JSON.stringify({ id: accountId, ...accountData });
        const leafHash = crypto.createHash('sha256').update(rawSerializedPayload).digest('hex');
        
        this.leaves.push(leafHash);
        
        // Regenerate the state root hash to bundle the tracking metrics
        let treeBuffer = Buffer.from(this.currentMerkleRoot);
        this.leaves.forEach(leaf => {
            treeBuffer = Buffer.concat([treeBuffer, Buffer.from(leaf)]);
        });

        this.currentMerkleRoot = crypto.createHash('sha256').update(treeBuffer).digest('hex');
        console.log(`[Success] On-chain Anchor Root updated: ${this.currentMerkleRoot}`);
    }
}

const indexer = new SonicCompressionIndexer();

// Simulate consecutive dynamic user asset modifications
indexer.compressAccountState("SonicPlayerAccX102", { level: 42, inventoryCount: 15 });
indexer.compressAccountState("SonicPlayerAccY509", { level: 88, inventoryCount: 112 });

module.exports = SonicCompressionIndexer;
