import redis from 'redis';

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher  = redis.createClient();
        this.subscriber = redis.createClient();
        this.init();
    }

    handleFunctions = {
        'BLOCKCHAIN' : ((message) => {
            const newChain = JSON.parse(message);
            this.blockchain.replaceChain(newChain);
        })
    }

    async init() {
        await this.subscriber.connect();
        console.log('PubSub subscriber connected')
        await this.subscribe();
        console.log(`PubSub subscriber subscribed to channel ${CHANNELS.BLOCKCHAIN}`);
        await this.publisher.connect();
        console.log(`PubSub publisher connected`);
    }

    subscribe() {
        return this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message, channel) => {
            this.handleMessage(channel, message);
        });
    }

    handleMessage(channel, message) {
        console.log(`Message on channel ${channel} received: ${message}`);
        if (channel in this.handleFunctions) {
            this.handleFunctions[channel](message);
        }
    }

    async publishChain() {
        await this.subscriber.unsubscribe(CHANNELS.BLOCKCHAIN); 
        await this.publisher.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain));
        await this.subscribe();
    }
}

export default PubSub;