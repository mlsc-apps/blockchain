import { GENESIS_DATA, MINE_RATE } from './config.js';
import { cryptoHash } from './crypto-hash.js';
import hexToBinary from 'hex-to-binary';

class Block {
    
    constructor({ timestamp, data, hash, lastHash, difficulty, nonce }) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    static genesis() {
        return new Block(GENESIS_DATA);
    }

    static AdjustDifficulty(lastBlock, currentTimestamp) {
        if (currentTimestamp - lastBlock.timestamp < MINE_RATE) return lastBlock.difficulty + 1;
        if (currentTimestamp - lastBlock.timestamp > MINE_RATE) return lastBlock.difficulty === 1 ? 1 : lastBlock.difficulty - 1;
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash  = lastBlock.hash;
        let difficulty  = lastBlock.difficulty;
        
        let nonce = 0;
        let hash;
        let timestamp;

        do {
            timestamp = Date.now();
            nonce++;
            difficulty = Block.AdjustDifficulty(lastBlock, timestamp);
            hash = cryptoHash(timestamp, data, lastHash, nonce);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block({
            timestamp,
            data,
            lastHash,
            difficulty,
            nonce,
            hash
        })

        
    }
}

export default Block;