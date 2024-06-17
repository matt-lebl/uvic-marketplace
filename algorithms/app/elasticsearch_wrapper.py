from elasticsearch import Elasticsearch, ConnectionError
import time
import os
from threading import Lock

class ElasticsearchWrapper:
    _instance = None
    _lock = Lock()  # Lock for thread-safe singleton initialization

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
        return cls._instance

    def __init__(self, timeout=60, interval=3):
        # Ensure __init__ runs only once
        if self._initialized:
            return
        self.host = os.environ["ELASTICSEARCH_URL"]
        self.timeout = timeout
        self.interval = interval
        self._es = None
        self._wait_for_elasticsearch()
        self._initialized = True

    def _wait_for_elasticsearch(self):
        start_time = time.time()
        while True:
            try:
                self._es = Elasticsearch(self.host)
                if self._es.ping():
                    self.create_indices()
                    print("Elasticsearch is ready!")
                    break
            except ConnectionError:
                pass
            if time.time() - start_time > self.timeout:
                raise TimeoutError("Timed out waiting for Elasticsearch to be ready.")
            print(f"Waiting for Elasticsearch... ({self.interval}s)")
            time.sleep(self.interval)

    @property
    def es(self):
        if self._es is None:
            self._wait_for_elasticsearch()
        return self._es
    
    def create_indices(self):
        if not self._es.indices.exists(index="listings_index"):
            self._es.indices.create(index="listings_index", 
                                    body={
                "mappings": {
                    "properties": {
                        "listingID": { "type": "keyword" },
                        "title": { "type": "text" },
                        "description": { "type": "text" },
                        "price": { "type": "float" },
                        "location": { "type": "geo_point" },
                        "images": {
                            "type": "nested",
                            "properties": {
                                "url": { "type": "keyword" }
                            }
                        }
                    }
                }
            })

        if not self._es.indices.exists(index="interactions_index"):
            self._es.indices.create(index="interactions_index", 
                                    body={
                "mappings": {
                    "properties": {
                        "userID": { "type": "keyword" },
                        "listingID": { "type": "keyword" },
                        "timestamp": { "type": "date" }
                    }
                }
            })
        
    @classmethod
    def reset_instance(cls):
        with cls._lock:
            cls._instance = None
            cls._lock = Lock()

    @classmethod
    def use_test_instance(cls):
        cls.reset_instance()
        return ElasticsearchWrapper()

