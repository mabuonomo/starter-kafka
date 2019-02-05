import { ConsumerGroupStreamOptions } from "kafka-node";
const { KAFKA_HOST, CONSUMER_GROUP_ID } = require('../../config');

export const consumerOptions: ConsumerGroupStreamOptions = {
    kafkaHost: KAFKA_HOST,
    groupId: CONSUMER_GROUP_ID,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    id: 'consumer1',
    fromOffset: 'latest'
};