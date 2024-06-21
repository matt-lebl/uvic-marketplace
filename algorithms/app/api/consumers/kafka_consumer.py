from confluent_kafka import Consumer, KafkaException
import os
import json
import algorithms.app.api.consumers.interactions
import algorithms.app.api.consumers.listings
import algorithms.app.api.consumers.users
from algorithms.app.api.deps import get_db

# Kafka Consumer configuration
conf = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092'),
    'group.id': 'my-consumer-group',
    'auto.offset.reset': 'earliest'
}

consumer = Consumer(conf)
db_session = get_db()

def consume_topics(topics):
    consumer.subscribe(topics)

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaException._PARTITION_EOF:
                    continue
                else:
                    print(f"Consumer error: {msg.error()}")
                    continue
            
            print(f"Received message: {msg.value().decode('utf-8')}")

            # Dispatch to appropriate handlers based on the topic
            if msg.topic() == "create-listing":
                handle_create_listing(msg.value().decode('utf-8'))
            elif msg.topic() == "delete-listing":
                handle_delete_listing(msg.value().decode('utf-8'))
            elif msg.topic() == "update-listing":
                handle_update_listing(msg.value().decode('utf-8'))
            elif msg.topic() == "view-listing":
                handle_view_listing(msg.value().decode('utf-8'))
            elif msg.topic() == "create-user":
                handle_create_user(msg.value().decode('utf-8'))
            elif msg.topic() == "edit-user":
                handle_edit_user(msg.value().decode('utf-8'))
            elif msg.topic() == "delete-user":
                handle_delete_user(msg.value().decode('utf-8'))


    finally:
        consumer.close()

def handle_create_listing(value):
    print(f"Handle create listing with value: {value}")
    data = json.loads(value)
    algorithms.app.api.consumers.listings.create_listing(data, db_session)

def handle_delete_listing(value):
    print(f"Handle delete listing with value: {value}")
    data = json.loads(value)
    algorithms.app.api.consumers.listings.delete_listing(data, db_session)

def handle_update_listing(value):
    print(f"Handle update listing with value: {value}")
    data = json.loads(value)
    algorithms.app.api.consumers.listings.create_listing(data, db_session)

def handle_view_listing(value):
    print(f"Handle view listing with value: {value}")
    data = json.loads(value)
    algorithms.app.api.consumers.interactions.record_click(data, db_session)

def handle_create_user(value):
    print(f"Handle create user with value: {value}")
    data = json.loads(value)
    algorithms.app.api.consumers.users.add_user(data, db_session)

def handle_edit_user(value):
    print(f"Handle edit user with value: {data}")
    data = json.loads(value)
    algorithms.app.api.consumers.users.edit_user(data, db_session)

def handle_delete_user(value):
    print(f"Handle delete user with value: {data}")
    data = json.loads(value)
    algorithms.app.api.consumers.users.delete_user(data, db_session)