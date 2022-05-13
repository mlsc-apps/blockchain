import BlockChain from '../js/blockchain.js';
import Block from '../js/block.js';
import {jest} from '@jest/globals';

describe('Test Blockchain class', () => {
    let blockchain, newBlockchain;
    let originalChain;
    
    beforeEach(() => {
        blockchain    = new BlockChain();
        newBlockchain = new BlockChain();
    });

    it('Test 1: Blockchain contains `chain` instance of Array', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('Test 2: Blockchain starts with genesis node', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('Test 3: Adds new block to the chain', () => {
        const newData = 'new Trx';
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {

        beforeEach(() => {
            blockchain.addBlock({ data : 'Block-1'});
            blockchain.addBlock({ data : 'Block-2'});
            blockchain.addBlock({ data : 'Block-3'});
        });

        it('Test 1: Chain is valid', () => {
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
        });

        it('Test 2: Chain does not start with genesis block', () => {
            blockchain.chain[0] = { data : 'fake-data'}
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });

        it('Test 3: One Block hash is invalid', () => {
            blockchain.chain[2].hash = 'fake-data-hash';
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });

        it('Test 4: One Block last hash is invalid', () => {
            blockchain.chain[2].lastHash = 'fake-last-hash';
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });

            describe('replaceChain()', () => {

                let errorMock, logMock;

                beforeEach(() => {
                    newBlockchain.addBlock({ data : 'Block-1'});
                    newBlockchain.addBlock({ data : 'Block-2'});
                    newBlockchain.addBlock({ data : 'Block-3'});
                    originalChain = blockchain.chain;

                    errorMock = jest.fn();
                    logMock = jest.fn();
    
                    global.console.error = errorMock;
                    global.console.log = logMock;
                });

                it('Test 1: New chain is not longer', () => {
                    blockchain.replaceChain(newBlockchain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                    expect(logMock).toHaveBeenCalled();
                });

                it('Test 2: New chain is longer but invalid', () => {
                    newBlockchain.addBlock({ data : 'Block-4'});
                    newBlockchain.chain[3].hash = 'fake-hash';
                    blockchain.replaceChain(newBlockchain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                    expect(logMock).toHaveBeenCalled();
                });

                it('Test 3: New chain is longer and valid', () => {
                    newBlockchain.addBlock({ data : 'Block-4'});
                    blockchain.replaceChain(newBlockchain.chain);
                    expect(blockchain.chain).toEqual(newBlockchain.chain);
                    expect(logMock).toHaveBeenCalled();
                });
            });

    });

});