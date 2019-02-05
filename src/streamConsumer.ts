import { ProducerStream, ConsumerGroupStream } from "kafka-node";
import { Transform } from "stream";
import { producerStreamOptions } from "./options/optionsProducer";
import { consumerOptions } from "./options/optionsConsumer";

const { TOPIC_FINAL } = require('../config');

const resultProducer = new ProducerStream(producerStreamOptions);
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
      topic: TOPIC_FINAL,
      messages: `You have been (${json}) made an example of`
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);