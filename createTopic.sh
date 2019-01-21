# docker run --rm -it --net=host landoop/fast-data-dev kafka-topics --zookeeper 127.0.0.1:2181 --topic webevents.dev --replication-factor 1 --partitions 100 --create
# docker run --rm -it --net=host landoop/fast-data-dev kafka-topics --zookeeper 127.0.0.1:2181 --topic finalevents --replication-factor 1 --partitions 100 --create
docker run --rm  -it --net=host landoop/fast-data-dev kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic webevents.dev