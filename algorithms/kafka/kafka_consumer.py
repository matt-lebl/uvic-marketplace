from confluent_kafka import Consumer, KafkaException
import os
import json
from consumers.interactions import record_click 
from consumers.listings import create_listing, delete_listing
from consumers.users import add_user, edit_user, delete_user
from db.deps import get_db

# Kafka Consumer configuration
conf = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', '70.66.242.15:29092'),
    'group.id': 'algorithms-consumer',
    'auto.offset.reset': 'earliest'
}

consumer = Consumer(conf)

def consume_topics(topics):
    print("Kafka consumer created")
    consumer.subscribe(topics)
    print(f"Kafka consumer subscribed to {topics}. Awaiting messages...")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                print(f"Consumer error: {msg.error()}")
                continue

            message_contents = msg.value().decode('utf-8')
            print(f"Received Kafka message: {message_contents}")
            
            try:
                message_json = json.loads(message_contents)
            except ValueError as e:
                print(f"Error decoding json: {e}")
                continue

            db_session = next(get_db())  # Get the database session
            try:
                # Dispatch to appropriate handlers based on the topic
                if msg.topic() == "create-listing":
                    handle_create_listing(message_json, db_session)
                elif msg.topic() == "delete-listing":
                    handle_delete_listing(message_json, db_session)
                elif msg.topic() == "update-listing":
                    handle_update_listing(message_json, db_session)
                elif msg.topic() == "view-listing":
                    handle_view_listing(message_json, db_session)
                elif msg.topic() == "create-user":
                    handle_create_user(message_json, db_session)
                elif msg.topic() == "edit-user":
                    handle_edit_user(message_json, db_session)
                elif msg.topic() == "delete-user":
                    handle_delete_user(message_json, db_session)
            finally:
                db_session.close()
    finally:
        consumer.close()

def handle_create_listing(data, db_session):
    print(f"Handle create listing with data: {data}")
    create_listing(data, db_session)

def handle_delete_listing(data, db_session):
    print(f"Handle delete listing with data: {data}")
    delete_listing(data, db_session)

def handle_update_listing(data, db_session):
    print(f"Handle update listing with data: {data}")
    create_listing(data, db_session)

def handle_view_listing(data, db_session):
    print(f"Handle view listing with data: {data}")
    record_click(data, db_session)

def handle_create_user(data, db_session):
    print(f"Handle create user with data: {data}")
    add_user(data, db_session)

def handle_edit_user(data, db_session):
    print(f"Handle edit user with data: {data}")
    edit_user(data, db_session)

def handle_delete_user(data, db_session):
    print(f"Handle delete user with data: {data}")
    delete_user(data, db_session)

if __name__ == "__main__":
    try:
        print("Kafka start")
        topic_list = os.environ['KAFKA_TOPICS'].split()
        consume_topics(topic_list)
    except KeyError:
        print("Could not find environment variable 'KAFKA_TOPICS'")
    except ValueError:
        print("Could not fetch Kafka topic list")
