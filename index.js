import express     from 'express';
import BlockChain  from './js/blockchain.js';
import bodyParser  from 'body-parser';
import PubSub from './js/pubsub.js';
import axios  from 'axios';

const DEFAULT_PORT = 3000;
const DEFAULT_ROOT_ADDRESS = 'http://localhost';

const app = express();
const blockchain = new BlockChain();
const pubSub = new PubSub({blockchain});

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    let { data } = req.body;
    blockchain.addBlock({ data });
    console.log(`New block added. Publishing to PubSub`);
    pubSub.publishChain();
    
    // res.redirect('/api/blocks');
    res.sendStatus(200);
});

const PORT = process.argv[2] || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Http Server listening on port ${PORT}`);
});

async function synchChain() {
    try {
        const response = await axios.get(`${DEFAULT_ROOT_ADDRESS}:${DEFAULT_PORT}/api/blocks`);
        const { data } = response;
        console.log(`Synchonizing blocks with root node`);
        console.log(data);
        blockchain.replaceChain(data);
    } catch(error) {
        console.log(error);
    }
};

if (PORT !== DEFAULT_PORT) {
    synchChain();
}