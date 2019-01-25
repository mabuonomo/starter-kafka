import { ProducerStream, ConsumerGroupStream, ConsumerGroupStreamOptions } from "kafka-node";
import { Transform } from "stream";
import { ConsumerOptions } from "kafka-node";

// const ProducerStream = require('./lib/producerStream');
// const ConsumerGroupStream = require('./lib/consumerGroupStream');
const resultProducer = new ProducerStream();
const { KAFKA_HOST2 } = require('./config');

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST2,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  //   asyncPush: false,
  id: 'consumer1',
  fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(message, encoding, callback) {

    let counter = message.value.split(' ')
      .map((v: string) => { let o = {}; o[v] = 1; return o; })
      .reduce((a: string, b: string) => {
        if (!Object.keys(a)[0].includes(Object.keys(b)[0])) return Object.assign(a, b);
        let c = Object.assign({}, a);
        c[Object.keys(b)[0]] = a[Object.keys(b)[0]] + 1;
        return c;
      });

    console.log(`Received message ${message.value} transforming input`);
    callback(null, {
      topic: 'RebalanceTopic',
      messages: `You have been (${JSON.stringify(counter)}) made an example of`
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);