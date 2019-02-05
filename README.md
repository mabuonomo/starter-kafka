# Starter Kafka Stream 

## Setup

```bash
docker-compose build
```

## Kafka UI

Visit http://127.0.0.1:3030 to inspect your kafka broker, topics, partitions etc.

## Usage

```bash
docker-compose up
docker-compose run node ts-node-dev src/streamProducer.ts
docker-compose run node ts-node-dev src/streamConsumer.ts
```

