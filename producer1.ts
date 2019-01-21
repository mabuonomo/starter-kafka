const Kafka = require('node-rdkafka');
console.log(Kafka.features);

// var producer = new Kafka.Producer({
//     'metadata.broker.list': 'kafka:9092'
// });

// var stream = Kafka.Producer.createWriteStream({
//     'metadata.broker.list': 'kafka:9092'
// }, {}, {
//         topic: 'topic-namae'
//     });

// // Writes a message to the stream
// var queuedSuccess = stream.write(Buffer.from('Awesome message'));
// console.log(queuedSuccess);

// if (queuedSuccess) {
//     console.log('We queued our message!');
// } else {
//     // Note that this only tells us if the stream's queue is full,
//     // it does NOT tell us if the message got to Kafka!  See below...
//     console.log('Too many messages in our queue already');
// }

// // NOTE: MAKE SURE TO LISTEN TO THIS IF YOU WANT THE STREAM TO BE DURABLE
// // Otherwise, any error will bubble up as an uncaught exception.
// stream.on('error', function (err) {
//     // Here's where we'll know if something went wrong sending to Kafka
//     console.error('Error in our kafka stream');
//     console.error(err);
// })

var producer = new Kafka.Producer({
    'metadata.broker.list': 'kafka:9092',
    'dr_cb': true
});

// Connect to the broker manually
producer.connect();

// Wait for the ready event before proceeding
producer.on('ready', function () {
    console.log("ready");
    try {
        producer.produce(
            // Topic to send the message to
            'topic',
            // optionally we can manually specify a partition for the message
            // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
            null,
            // Message to send. Must be a buffer
            Buffer.from('Awesome message'),
            // for keyed messages, we also specify the key - note that this field is optional
            'Stormwind',
            // you can send a timestamp here. If your broker version supports it,
            // it will get added. Otherwise, we default to 0
            Date.now(),
            // you can send an opaque token here, which gets passed along
            // to your delivery reports
        );
    } catch (err) {
        console.error('A problem occurred when sending our message');
        console.error(err);
    }
});

// Any errors we encounter, including connection errors
producer.on('event.error', function (err) {
    console.error('Error from producer');
    console.error(err);
})

// var producer = new Kafka.Producer({
//     'client.id': 'my-client', // Specifies an identifier to use to help trace activity in Kafka
//     'metadata.broker.list': 'kafka:9092', // Connect to a Kafka instance on localhost
//     'dr_cb': true // Specifies that we want a delivery-report event to be generated
//   });

//   // Poll for events every 100 ms
//   producer.setPollInterval(100);

//   producer.on('delivery-report', function(err, report) {
//     // Report of delivery statistics here:
//     //
//     console.log(report);
//   });