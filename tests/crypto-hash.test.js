import { cryptoHash } from '../js/crypto-hash.js';

describe ('Test cryptoHash function', () => {
    const albatros_hash256 = "7804cc0abacc62b5adbb9ab207b3493a7cc434921c45f74c3d721944fa7ff77e";

    it('Test 1: Function returns proper hash', () => {
        expect(cryptoHash('albatros')).toEqual(albatros_hash256);
    });

    it('Test 2: Function returns same hash for same arguments in different order', () => {
        expect(cryptoHash('albatros', 'tech')).toEqual(cryptoHash('tech', 'albatros'));
    });

});