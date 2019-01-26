import { ProducerStream, ConsumerGroupStream, ConsumerGroupStreamOptions } from "kafka-node";
import { Transform } from "stream";

const resultProducer = new ProducerStream();
const { KAFKA_HOST } = require('./config');

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  id: 'consumer1',
  fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(message, encoding, callback) {
    let counter: Map<string, number> = message.value.trim()
      .toLowerCase()
      .split(/\s+/)
      .reduce((map, word) => map.set(word, map.get(word) + 1 || 1), new Map());

    console.log(counter);

    let json = JSON.stringify([Array.from(counter)]);
    console.log(`Received message ${message.value} transforming input in ${json}`);
    callback(null, {
      topic: 'RebalanceTopic',
      messages: `You have been (${json}) made an example of`
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);