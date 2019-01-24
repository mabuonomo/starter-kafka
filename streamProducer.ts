import { ProducerStream, ProducerOptions, ProducerStreamOptions } from "kafka-node";
import { Transform } from "stream";
import * as _ from "lodash";
import { KafkaClientOptions } from "kafka-node";
import { KafkaClient } from "kafka-node";

// const Transform = require('stream').Transform;
// const ProducerStream = require('./lib/producerStream');
// const _ = require('lodash');
const { KAFKA_HOST } = require('./config');
type Record = { type: string, userId: string, sessionId: string, data: string };

console.log(KAFKA_HOST);

const options: KafkaClientOptions = {
    kafkaHost: KAFKA_HOST,
    connectTimeout: 1000,
    requestTimeout: 3000,
    autoConnect: true,
    // connectRetryOptions: RetryOptions,
    // sslOptions: any,
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
    // highWaterMark?: number;
}

// const client = new KafkaClient(KAFKA_HOST);// options);

const producer = new ProducerStream(cc);

const stdinTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(text, encoding, callback) {
        text = _.trim(text);
        console.log(`pushing message ${text} to ExampleTopic`);
        callback(null, {
            topic: 'ExampleTopic',
            messages: text
        });
    }
});

process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);