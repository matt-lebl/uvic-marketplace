#!/bin/bash

echo "Creating Kafka topics..."
echo "$KAFKA_NODE_HOSTNAME"
echo "$KAFKA_NODE_PORT"

# Wait for Kafka to be ready
while ! nc -z "$KAFKA_NODE_HOSTNAME" "$KAFKA_NODE_PORT"; do
  echo "Waiting for Kafka Node to come online" && sleep 1
done

# List of topics to create
topics="create-listing delete-listing update-listing view-listing create-user edit-user delete-user"

for topic in $topics; do
  ./opt/kafka/bin/kafka-topics.sh --create --topic "$topic" --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server "$KAFKA_NODE_HOSTNAME":"$KAFKA_NODE_PORT"
done
