import { KafkaClient, ProducerOptions, KeyedMessage, Producer } from "kafka-node";
import uuid = require("uuid");

const { KAFKA_BROKER_HOST } = require('./config');
type Record = { type: string, userId: string, sessionId: string, data: string };

console.log(KAFKA_BROKER_HOST);

const ops: ProducerOptions = {
    requireAcks: 1,
    ackTimeoutMs: 100,
    partitionerType: 2
}

const client = new KafkaClient(KAFKA_BROKER_HOST);

const producer = new Producer(client, ops); 

let km = new KeyedMessage('key', 'message');
let payloads = [
    { topic: 'topic', messages: 'hi', partition: 0 },
    { topic: 'topic', messages: ['hello', 'world', km] }
];

let rc: Record = {
    type: 'webevents.dev', userId: 'my-client-id',
    sessionId: 'webevents.dev ', data: 'test'
};
const kafkaTopic = 'socketTopicTest';
const kafkaMessage = rc;

producer.on("ready", function () {
    console.log("Kafka Producer is connected and ready.");

    console.log("Sending...");

    producer.createTopics([kafkaTopic], true, function (errToCreateTopic, topicCreated) {
        if (!errToCreateTopic) {
            console.log("topic creato");
            producer.send([{
                topic: kafkaTopic, partition: 0, messages: [JSON.stringify(kafkaMessage)], attributes: 0
            }], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
        } else {
            console.log("topic non creato");
        }
    });
});

producer.on("error", function (error) {
    console.error(error);
});