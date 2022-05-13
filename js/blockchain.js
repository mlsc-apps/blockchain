import Block from './block.js';
import { cryptoHash } from './crypto-hash.js';

class BlockChain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock : this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
    }

    // static to be able to check other chains
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            if (block.lastHash !== chain[i-1].hash) return false;
            if (block.hash !== cryptoHash(block.timestamp, block.data, block.lastHash, block.nonce)) return false;
            if (Math.abs(block.difficulty - chain[i-1].difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(newChain) {
        let newChainLonger = newChain.length > this.chain.length;
        let newChainValid  = BlockChain.isValidChain(newChain);

        if (newChainLonger && newChainValid) {
            this.chain = newChain;
            console.log('Replacing current chain with new chain', newChain);
        } else {
            if (!newChainLonger) console.log(`Replace chain failed: new chain must be longer`);
            if (!newChainValid)  console.log(`Replace chain failed: new chain is invalid`);
        }
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

}

export default BlockChain;