import { ProducerStream, ConsumerGroupStream, ConsumerGroupStreamOptions, ProducerStreamOptions } from "kafka-node";
import { Transform } from "stream";
import { KafkaClientOptions } from "kafka-node";
import { ProducerOptions } from "kafka-node";

// const resultProducer = new ProducerStream();
const { KAFKA_HOST } = require('./config');

const options: KafkaClientOptions = {
  kafkaHost: KAFKA_HOST,
  connectTimeout: 1000,
  requestTimeout: 3000,
  autoConnect: true,
  clientId: "my-client-id"
}

const ops: ProducerOptions = {
  requireAcks: 1,
  ackTimeoutMs: 100,
  partitionerType: 2
}

const cc: ProducerStreamOptions = {
  kafkaClient: options,
  producer: ops,
}

const resultProducer = new ProducerStream(cc);

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  id: 'consumer1',
  fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'socketTopicTest');

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(message, encoding, callback) {
    let counter: Map<string, number> = message.value.trim()
      .toLowerCase()
      .split(/\s+/)
      .reduce((map: Map<string, number>, word: string) => map.set(word, map.get(word) + 1 || 1), new Map());

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