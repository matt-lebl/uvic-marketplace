from confluent_kafka import Consumer, KafkaException
import os
import json
from consumers.interactions import record_click 
from consumers.listings import create_listing, delete_listing
from consumers.users import add_user, edit_user, delete_user
from app.db.deps import get_db

# Kafka Consumer configuration
conf = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', '"70.66.242.15:29092"'),
    'group.id': 'algorithms-consumer',
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
    create_listing(data, db_session)

def handle_delete_listing(value):
    print(f"Handle delete listing with value: {value}")
    data = json.loads(value)
    delete_listing(data, db_session)

def handle_update_listing(value):
    print(f"Handle update listing with value: {value}")
    data = json.loads(value)
    create_listing(data, db_session)

def handle_view_listing(value):
    print(f"Handle view listing with value: {value}")
    data = json.loads(value)
    record_click(data, db_session)

def handle_create_user(value):
    print(f"Handle create user with value: {value}")
    data = json.loads(value)
    add_user(data, db_session)

def handle_edit_user(value):
    print(f"Handle edit user with value: {data}")
    data = json.loads(value)
    edit_user(data, db_session)

def handle_delete_user(value):
    print(f"Handle delete user with value: {data}")
    data = json.loads(value)
    delete_user(data, db_session)

if __name__ == "__main__":
    try:
        topic_list = os.environ['KAFKA_TOPICS'].split()
        consume_topics(topic_list)
    except KeyError:
        print("Could not find environment variable 'KAFKA_TOPICS'")
    except ValueError:
        print("Could not fetch Kafka topic list")