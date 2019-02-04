# Nodejs Kafka

## Setup

Make sure you have following on your local machine installed
>   docker - 18.03.1
>   docker-compose - 1.21.1
>   node - 9.9.0
>   npm - 5.6.0

Install Project

    npm install
    docker-compose up

Kafka UI

   Visit http://127.0.0.1:3030 to inspect your kafka broker, topics, partitions etc.

## Usage

docker-compose up
docker-compose run node ts-node-dev producer.ts
docker-compose run node ts-node-dev consumer.ts

