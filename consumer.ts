// import kafka, { Message, HighLevelConsumer, HighLevelConsumerOptions, Client } from "kafka-node"

// import { KafkaClient, KafkaClientOptions, HighLevelProducer } from "kafka-node";
// import uuid from "uuid";

// const { KAFKA_HOST } = require('./config');

// const options: KafkaClientOptions = {
//     kafkaHost: KAFKA_HOST,
//     connectTimeout: 100,
//     requestTimeout: 300,
//     autoConnect: true,
//     // connectRetryOptions: RetryOptions,
//     // sslOptions: any,
//     clientId: "my-client-id"
// }

// const client = new Client(KAFKA_HOST); //"http://localhost:2181");

// const topics = [
//     {
//         topic: "webevents.dev"
//     }
// ];

// const optionsConsumer: HighLevelConsumerOptions = {
//     autoCommit: true,
//     fetchMaxWaitMs: 1000,
//     fetchMaxBytes: 1024 * 1024,
//     encoding: "buffer"
// };

// const consumer = new HighLevelConsumer(client, topics, optionsConsumer);

// consumer.on("message", function (message: Message) {

//     // Read string into a buffer.
//     var buf = new Buffer(message.value as string, "binary");
//     var decodedMessage = JSON.parse(buf.toString());

//     //Events is a Sequelize Model Object. 
//     return {
//         id: decodedMessage.id,
//         type: decodedMessage.type,
//         userId: decodedMessage.userId,
//         sessionId: decodedMessage.sessionId,
//         data: JSON.stringify(decodedMessage.data),
//         createdAt: new Date()
//     };
// });

// consumer.on("error", function (err) {
//     console.log("error", err);
// });

// process.on("SIGINT", function () {
//     consumer.close(true, function () {
//         process.exit();
//     });
// });