import { ProducerStream, ProducerOptions, ProducerStreamOptions } from "kafka-node";
import { Transform } from "stream";
import * as _ from "lodash";
import { KafkaClientOptions } from "kafka-node";

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

const producer = new ProducerStream(cc);

const stdinTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(text, encoding, callback) {
        text = _.trim(text);
        console.log(`pushing message ${text} to socketTopicTest`);
        callback(null, {
            topic: 'socketTopicTest',
            messages: text
        });
    }
});

process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);