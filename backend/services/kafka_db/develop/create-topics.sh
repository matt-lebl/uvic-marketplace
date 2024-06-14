#!/bin/bash

# Wait for Kafka to be ready
while ! nc -z kafka-1 19092; do
  echo "Waiting for Kafka-1" && sleep 20
done

# List of topics to create
topics="create-listing delete-listing update-listing view-listing create-user edit-user delete-user"

for topic in $topics; do
  ./opt/kafka/bin/kafka-topics.sh --create --topic "$topic" --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server kafka-1:19092
done
