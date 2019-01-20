import { KafkaClient, KafkaClientOptions, HighLevelProducer, ProduceRequest } from "kafka-node";
import uuid = require("uuid");

const { KAFKA_HOST } = require('./config');

const options: KafkaClientOptions = {
    kafkaHost: KAFKA_HOST,
    connectTimeout: 1000,
    requestTimeout: 3000,
    autoConnect: true,
    // connectRetryOptions: RetryOptions,
    // sslOptions: any,
    clientId: "my-client-id"
}

const plus = {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
}

// export interface ProducerOptions {
//     requireAcks?: number;
//     ackTimeoutMs?: number;
//     partitionerType?: number;
// }

const client = new KafkaClient(options);

const producer = new HighLevelProducer(client); // kafka.HighLevelProducer(client);

producer.on("ready", function () {
    console.log("Kafka Producer is connected and ready.");

    // producer.createTopics(["test1"], (error: any, data: any) => { console.log(error); console.log(data); });

    KafkaService.sendRecord({
        type: 'webevents.dev', userId: 'my-client-id',
        sessionId: 'webevents.dev ', data: { 'test': 'webevents.dev' }
    });

});

// For this demo we just log producer errors to the console.
producer.on("error", function (error) {
    console.error(error);
});

const KafkaService = {
    sendRecord: ({ type, userId, sessionId, data }, callback = (error: Error) => { console.log(error); }) => {
        if (!userId) {
            return callback(new Error(`A userId must be provided.`));
        }

        const event = {
            id: uuid.v4, // uuid.v4(),
            timestamp: Date.now(),
            userId: userId,
            sessionId: sessionId,
            type: type,
            data: data
        };

        const buffer = Buffer.from(JSON.stringify(event));
        // console.log(buffer);

        // Create a new payload
        const record: ProduceRequest[] = [
            {
                topic: "webevents.te",
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payload */
            }
        ];

        console.log("Kafka Producer sending...");

        //Send record to Kafka and log result/error
        producer.send(record, callback);
    }
};

export default KafkaService;