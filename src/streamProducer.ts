import { ProducerStream, ProducerOptions, ProducerStreamOptions } from "kafka-node";
import { Transform } from "stream";
import * as _ from "lodash";
import { producerStreamOptions } from "./options/optionsProducer";

const { TOPIC_INITIAL } = require('../config');

const producer = new ProducerStream(producerStreamOptions);

const stdinTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(text, encoding, callback) {
        text = _.trim(text);
        console.log(`pushing message ${text} to socketTopicTest`);
        callback(null, {
            topic: TOPIC_INITIAL,
            messages: text
        });
    }
});

process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);