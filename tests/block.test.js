import Block from '../js/block.js';
import { GENESIS_DATA, MINE_RATE } from '../js/config.js'
import { cryptoHash } from '../js/crypto-hash.js';
import hexToBinary from 'hex-to-binary';

describe ('Test Block', () => {
    const timestamp = 'timestamp';
    const lastHash  ='lastHash';
    const hash = 'hash';
    const data = "data";
    const difficulty = 1;
    const nonce = 1;

    const block = new Block({ timestamp, data, hash, lastHash , difficulty, nonce });

    it('Test 1: Block has all required properties', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.nonce).toEqual(nonce);
    });

});

describe ('Test Genesis Block', () => {
    const genesis = Block.genesis();

    it('Test 1: Block genesis returns Block instance', () => {
        expect(genesis instanceof Block).toBe(true);
    });

    it('Test 2: Block returns genesis data', () => {
        expect(genesis.timestamp).toEqual(GENESIS_DATA.timestamp);
        expect(genesis.hash).toEqual(GENESIS_DATA.hash);
        expect(genesis.data).toEqual(GENESIS_DATA.data);
        expect(genesis.lastHash).toEqual(GENESIS_DATA.lastHash);
        expect(genesis.nonce).toEqual(GENESIS_DATA.nonce);
        expect(genesis.difficulty).toEqual(GENESIS_DATA.difficulty);
    });
});

describe ('Test Block Mining', () => {
    const lastBlock = Block.genesis();
    const data = "Tx";
    const newBlock = Block.mineBlock({ lastBlock , data });

    it('Test 1: Block returns Block instance', () => {
        expect(newBlock instanceof Block).toBe(true);
    });

    it('Test 2: Block sets timestamp', () => {
        expect(newBlock.timestamp).not.toEqual(undefined);
    });

    it('Test 3: Sets lastHash to hash of previous Block', () => {
        expect(newBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('Test 4: Sets data to passed data', () => {
        expect(newBlock.data).toEqual(data);
    });

    it('Test 5: Sets Block hash based on Block input data', () => {
        expect(newBlock.hash).toEqual(cryptoHash(newBlock.timestamp, newBlock.lastHash, newBlock.data, newBlock.nonce));
    });

    it('Test 6: Sets first bits of Block hash based on difficulty', () => {
        // console.log(newBlock);
        expect(hexToBinary(newBlock.hash).substring(0, newBlock.difficulty)).toEqual('0'.repeat(newBlock.difficulty));
    });

    it('Test 7: Increase difficulty when mining too fast', () => {
        expect(Block.AdjustDifficulty(newBlock, newBlock.timestamp + MINE_RATE - 100)).toEqual(newBlock.difficulty + 1);
    });

    it('Test 8: Decrease difficulty when mining too slow and difficulty > 1', () => {
        newBlock.difficulty = 2;
        expect(Block.AdjustDifficulty(newBlock, newBlock.timestamp + MINE_RATE + 100)).toEqual(newBlock.difficulty - 1);
    });

    it('Test 8: Return difficulty 1 when mining too slow but difficulty already 1', () => {
        newBlock.difficulty = 1;
        expect(Block.AdjustDifficulty(newBlock, newBlock.timestamp + MINE_RATE + 100)).toEqual(1);
    });
});