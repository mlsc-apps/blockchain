
import BlockChain from './blockchain.js';

let blockchain = new BlockChain();

blockchain.addBlock({ data : 'new block' });

let times = [];
let average = 0;
let totalTime = 0;
let index = 1;

for (let i = 0; i <10000; i++) {
    let lastTimeStamp = blockchain.getLastBlock().timestamp;
    blockchain.addBlock(` block ${i}`);
    let newlyBlock = blockchain.getLastBlock();
    let currentTimeStamp = newlyBlock.timestamp;
    let diff = currentTimeStamp - lastTimeStamp;
    // times.push(diff);

    // average = times.reduce((total, num) => total + num) / times.length;
    totalTime += diff;
    average = totalTime / index++;
    console.log(`Time to mine: ${diff} ms, diffculty: ${newlyBlock.difficulty}, average time: ${average}`);
    
}

