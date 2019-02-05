import { ConsumerGroupStreamOptions } from "kafka-node";
const { KAFKA_HOST } = require('../../config');

export const consumerOptions: ConsumerGroupStreamOptions = {
    kafkaHost: KAFKA_HOST,
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    id: 'consumer1',
    fromOffset: 'latest'
};