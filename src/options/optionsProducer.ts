import * as _ from "lodash";
import { KafkaClientOptions, ProducerOptions, ProducerStreamOptions } from "kafka-node";

const { KAFKA_HOST } = require('../../config');

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

export const producerStreamOptions: ProducerStreamOptions = {
    kafkaClient: options,
    producer: ops,
}
