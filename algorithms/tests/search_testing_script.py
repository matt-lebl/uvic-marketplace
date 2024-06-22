import requests
import random
import json

def add_listings(base_url):
    base_titles = [
        ("iPhone 12, {} GB, {}", "Excellent condition, includes {} and charger", [64, 128, 256], ["original box", "earphones"]),
        ("Samsung 55' 4K Smart TV", "No scratches, includes {} and HDMI cable", ["remote control"], ["wall mount", "stand"]),
        ("Leather Sofa, {}", "Comfortable, {} on the left armrest", ["great condition", "moderate wear"], ["minor wear", "some scratches"]),
        ("Nike Air Max, Size {}", "Worn {} times, almost like new", [9, 10, 11], ["a few", "several"]),
        ("Trek Mountain Bike, {}", "Recently serviced, perfect for {}", ["barely used", "good condition"], ["trail riding", "road biking"]),
        ("Kitchen Table Set with 4 Chairs", "Modern style, {} on table surface", ["some scratches", "a few marks"], ["clean", "well-maintained"]),
        ("Dell XPS 15 Laptop", "2020 model, {} RAM, {} SSD, perfect working condition", ["16GB", "32GB"], ["512GB", "1TB"]),
        ("Men's Leather Jacket Size L", "Black leather, vintage style, {}", ["very good condition", "excellent shape"], ["minimal use", "rarely worn"]),
        ("Canon EOS 80D DSLR Camera", "Includes {} lens, battery, and camera bag", ["18-55mm", "50mm"], ["memory card", "extra battery"]),
        ("Yoga Mat, brand new", "Non-slip surface, {} color, includes carrying strap", ["purple", "blue"], ["lightweight", "thick padding"])
    ]

    for i in range(100):
        base_title, base_desc, options1, options2 = random.choice(base_titles)
        title = base_title.format(random.choice(options1), random.choice(options2))
        description = base_desc.format(random.choice(options2), random.choice(options1))

        listing_data = {
            "listing": {
                "listingID": str(i + 1),
                "title": title,
                "description": description,
                "price": round(random.uniform(10.99, 999.99), 2),
                "location": {
                    "latitude": round(random.uniform(34.0001, 34.9999), 5),
                    "longitude": round(random.uniform(-124.9999, -124.0001), 5)
                }
            }
        }
        response = requests.post(f"{base_url}/api/listing", json=listing_data)
        print(f"Added listing {i + 1}: {response.status_code}")

def perform_search_queries(base_url):
    queries = [
        "phone", "fitness", "electronics",
        "clothes", "furniture"
    ]
    headers = {"Authorization": "Bearer testtoken"}
    limit = 5
    for query in queries:
        print(f"Searching for '{query}'...")
        response = requests.get(f"{base_url}/api/search?query={query}&latitude=34.2331&longitude=-124.2323&limit={limit}", headers=headers)
        if response.status_code == 200:
            print(f"Search for '{query}': {response.status_code}")
            print(json.dumps(response.json(), indent=2))  # Indent for pretty printing
        else:
            print(f"Search for '{query}' failed with status: {response.status_code}")
            print(json.dumps(response.json(), indent=2))

def main():
    base_url = "http://localhost:8000"
    add_listings(base_url)
    perform_search_queries(base_url)

if __name__ == "__main__":
    main()
