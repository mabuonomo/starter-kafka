import { ProducerStream, ConsumerGroupStream, ConsumerGroupStreamOptions } from "kafka-node";
import { Transform } from "stream";
import { ConsumerOptions } from "kafka-node";

// const ProducerStream = require('./lib/producerStream');
// const ConsumerGroupStream = require('./lib/consumerGroupStream');
const resultProducer = new ProducerStream();
const { KAFKA_HOST } = require('./config');

const consumerOptions : ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
//   asyncPush: false,
  id: 'consumer1',
//   fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    console.log(`Received message ${message.value} transforming input`);
    callback(null, {
      topic: 'RebalanceTopic',
      messages: `You have been (${message.value}) made an example of`
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);