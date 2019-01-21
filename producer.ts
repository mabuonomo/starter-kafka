import { KafkaClient, KafkaClientOptions, HighLevelProducer, ProduceRequest, ProducerOptions, KeyedMessage } from "kafka-node";
import uuid = require("uuid");

const { KAFKA_HOST } = require('./config');
type Record = { type: string, userId: string, sessionId: string, data: string };

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

const client = new KafkaClient(options);

const producer = new HighLevelProducer(client, ops); // kafka.HighLevelProducer(client);

let km = new KeyedMessage('key', 'message');
let payloads = [
    { topic: 'topic1', messages: 'hi', partition: 0 },
    { topic: 'topic2', messages: ['hello', 'world', km] }
];

producer.on("ready", function () {
    console.log("Kafka Producer is connected and ready.");

    // producer.createTopics(["test1"], (error: any, data: any) => { console.log(error); console.log(data); });

    let rc: Record = {
        type: 'webevents.dev', userId: 'my-client-id',
        sessionId: 'webevents.dev ', data: 'test'
    };

    // KafkaService.sendRecord(rc);

    producer.send(payloads, function (err, data) {
        console.log(data);
        console.log(err);
    });
});

// For this demo we just log producer errors to the console.
producer.on("error", function (error) {
    console.error(error);
});

const KafkaService = {
    sendRecord: (rc: Record,
        callback = (error: Error, data: any) => { console.log(error); console.log(data); }) => {
        // if (!userId) {
        //     return callback(new Error(`A userId must be provided.`));
        // }

        // {
        //     topic: 'topicName',
        //     messages: ['message body'], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
        //     key: 'theKey', // string or buffer, only needed when using keyed partitioner
        //     partition: 0, // default 0
        //     attributes: 2, // default: 0
        //     timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
        //  }

        const event = {
            id: uuid.v4, // uuid.v4(),
            timestamp: Date.now(),
            userId: rc.userId,
            sessionId: rc.sessionId,
            type: rc.type,
            data: rc.data
        };

        const buffer = Buffer.from(JSON.stringify(event));
        // console.log(buffer);

        // Create a new payload
        const record: ProduceRequest[] = [
            {
                topic: "webevents.te",
                messages: 'buffer',
                // attributes: 4 //1 /* Use GZip compression for the payload */
            }
        ];

        console.log("Kafka Producer sending...");

        //Send record to Kafka and log result/error
        producer.send(record, callback);
    }
};

export default KafkaService;
