import requests
import random
import json
import uuid

user_ids = [str(uuid.uuid4()) for _ in range(5)]

def add_listings(base_url):
    items = [
        ("New Basketball", "Brand new basketball, never used."),
        ("Used Basketball Hoop", "Slightly worn but sturdy basketball hoop."),
        ("Nike Cleats", "Nike soccer cleats, size 10, excellent condition."),
        ("Adidas Running Shoes", "Nearly new Adidas shoes, size 9."),
        ("Tennis Racket", "Wilson tennis racket in great condition."),
        ("Football", "Leather football, good grip, like new."),
        ("Baseball Glove", "Youth baseball glove, good for beginners."),
        ("Golf Clubs", "Set of 10 golf clubs, perfect for intermediate players."),
        ("Yoga Mat", "Thick purple yoga mat, very clean."),
        ("Gym Weights", "Set of weights, 20 lbs each, no rust."),
        ("Mountain Bike Helmet", "Sturdy and reliable bike helmet, perfect for trail rides."),
        ("Camping Tent", "Four-person tent, easy to set up, used only once."),
        ("Fishing Rod", "Extendable fishing rod, great for freshwater lakes."),
        ("Skateboard", "Street skateboard in good condition, ideal for beginners."),
        ("Surfboard", "Longboard surfboard, great for all skill levels."),
        ("Roller Skates", "Women's size 7, hardly used, pink and white."),
        ("Scooter", "Electric scooter in excellent condition, fast charging."),
        ("Hiking Boots", "Men's size 10, durable and waterproof, suitable for all terrains."),
        ("Cricket Bat", "Professional grade cricket bat, lightweight and well-balanced."),
        ("Boxing Gloves", "16 oz gloves, suitable for training and sparring."),
        ("Volleyball", "Official size, suitable for indoor and beach play."),
        ("Basketball Shoes", "High-top, size 12, provides excellent ankle support."),
        ("Exercise Bike", "Stationary bike with multiple resistance settings."),
        ("Yoga Blocks", "Set of two foam blocks, helps improve your poses."),
        ("Dumbbell Set", "Adjustable weights, perfect for home workouts."),
        ("Electric Guitar", "Six-string guitar, comes with a small amp and cable."),
        ("Acoustic Guitar", "Beginner-friendly, with a smooth finish and rich sound."),
        ("Keyboard Piano", "61 keys, includes stand and sustain pedal."),
        ("Violin", "Full size, comes with bow and case, ideal for students."),
        ("Drum Kit", "Five-piece set, cymbals and stool included, good for beginners."),
        ("Microphone", "Condenser microphone, ideal for home recording setups."),
        ("Camera Tripod", "Adjustable height, lightweight, with a mobile adapter."),
        ("SLR Camera", "Digital SLR, 18MP, comes with two lenses and a bag."),
        ("GoPro Camera", "Waterproof action camera, perfect for adventure sports."),
        ("Binoculars", "High magnification, suitable for bird watching and sports."),
        ("Bookshelf", "Wooden, five shelves, can hold up to 50 books."),
        ("Desk Lamp", "LED, adjustable arm, with touch-sensitive controls."),
        ("Office Chair", "Ergonomic design, with lumbar support and adjustable height."),
        ("Laptop Stand", "Portable, adjustable angle, suitable for all laptop sizes."),
        ("Wireless Router", "Dual-band, supports up to 10 devices, easy setup."),
        ("Smartwatch", "Tracks fitness and sleep, compatible with iOS and Android."),
        ("Bluetooth Speaker", "Portable, waterproof, with a 10-hour battery life."),
        ("Headphones", "Noise-cancelling, over-ear, with a built-in microphone."),
        ("Portable Charger", "10000mAh, can charge a smartphone up to three times."),
        ("Flash Drive", "64GB, USB 3.0, fast data transfer speeds."),
        ("External Hard Drive", "1TB capacity, USB 3.0, includes backup software."),
        ("Printer", "All-in-one printer, supports wireless printing and scanning."),
        ("Smart Thermostat", "Energy-efficient, can be controlled via smartphone."),
        ("Air Purifier", "HEPA filter, quiet operation, suitable for large rooms."),
        ("Humidifier", "Ultrasonic, 2-liter tank, ideal for dry climates or winter."),
        ("Dehumidifier", "Efficient moisture removal, suitable for damp areas."),
        ("Space Heater", "Compact, energy-efficient, with adjustable thermostat."),
        ("Fan", "Oscillating tower fan, three speeds, with remote control."),
        ("Iron", "Steam iron, non-stick soleplate, includes water tank."),
        ("Vacuum Cleaner", "Bagless, powerful suction, comes with multiple attachments."),
        ("Blender", "High-speed, suitable for smoothies and shakes, easy to clean."),
        ("Microwave Oven", "Compact, with pre-programmed settings and timer."),
        ("Toaster", "Two-slice, adjustable browning settings, removable crumb tray."),
        ("Coffee Maker", "Brews up to 12 cups, programmable start time."),
        ("Electric Kettle", "1.7 liters, fast boiling, with auto shut-off feature."),
        ("Slow Cooker", "6-quart capacity, programmable settings, dishwasher safe."),
        ("Pressure Cooker", "Instant cooking, preserves nutrients, includes recipes."),
        ("Sandwich Maker", "Non-stick plates, easy to use and clean, compact design."),
        ("Electric Grill", "Indoor grill, smokeless, ideal for apartments or small kitchens."),
        ("Juicer", "Centrifugal type, easy to use and clean, extracts juice quickly."),
        ("Bread Maker", "Makes 2-pound loaves, multiple crust settings."),
        ("Ice Cream Maker", "Homemade ice cream, sorbet, and yogurt in under an hour."),
        ("Pasta Maker", "Automatic mixing and kneading, extrudes pasta in minutes."),
        ("Food Processor", "Multi-purpose, comes with various slicing and chopping blades."),
        ("Rice Cooker", "Cooks and steams rice and vegetables, includes timer."),
        ("Tea Set", "Porcelain, includes teapot and four cups, floral design."),
        ("Dinnerware Set", "16 pieces, microwave and dishwasher safe."),
        ("Cutlery Set", "Stainless steel, 20 pieces, includes a storage block."),
        ("Cookware Set", "Non-stick, includes pots, pans, and lids."),
        ("Baking Set", "Includes mixing bowls, measuring cups, and baking sheets."),
        ("Spice Rack", "Wooden, holds up to 20 spice jars."),
        ("Table Linens", "Set of placemats, napkins, and a table runner."),
        ("Area Rug", "5x7 feet, modern pattern, suitable for living or bedroom."),
        ("Curtains", "Blackout curtains, two panels, various colors available."),
        ("Throw Pillows", "Set of four, decorative, suitable for couch or bed."),
        ("Picture Frames", "Wooden, set of 5, various sizes, includes mounting hardware."),
        ("Vase", "Glass, suitable for fresh or artificial flowers."),
        ("Candle Holders", "Set of three, metal, includes candles."),
        ("Wall Art", "Canvas print, abstract design, 24x36 inches."),
        ("Floor Lamp", "Adjustable height, suitable for reading or ambient light."),
        ("Alarm Clock", "Digital, with snooze function and battery backup."),
        ("Wristwatch", "Men's, analog, leather strap, water-resistant."),
        ("Sunglasses", "Polarized, UV protection, includes case."),
        ("Wallet", "Leather, bi-fold, with multiple card slots and a coin pocket."),
        ("Handbag", "Leather, medium size, various colors available."),
        ("Backpack", "Durable, multiple compartments, suitable for school or travel."),
        ("Suitcase", "Hard shell, with wheels and extendable handle."),
        ("Travel Kit", "Includes travel-sized toiletries and a hanging organizer."),
        ("Fitness Tracker", "Monitors heart rate and steps, waterproof."),
        ("Dumbbells", "Set of two, 10 lbs each, rubber coated for grip."),
        ("Yoga Ball", "65 cm, includes pump, ideal for exercise or as a chair."),
        ("Resistance Bands", "Set of three, different resistance levels."),
        ("Skipping Rope", "Adjustable length, with counter and calorie meter."),
        ("Soccer Ball", "Official size, durable, suitable for all surfaces."),
        ("Hockey Stick", "Composite material, for ice or street hockey."),
        ("Tennis Balls", "Pack of three, high-quality, suitable for all court types.")
    ]

    for i in range(100):
        listing_data = {
            "listing": {
                "listingID": str(i + 1),
                "title": items[i][0],
                "description": items[i][1],
                "price": round(random.uniform(10.99, 999.99), 2),
                "location": {
                    "latitude": round(random.uniform(34.0001, 34.9999), 5),
                    "longitude": round(random.uniform(-124.9999, -124.0001), 5)
                },
                "dateCreated": "2024-07-25 01:24:22.794173",
                "seller_profile": {
                    "userID": "A12334B345",
                    "username": "hubert123",
                    "name": "Bartholomew Hubert",
                    "bio": "I love stuff",
                    "profilePictureUrl": "https://example.com/image.png"
                },

            } # not including optional fields "images" & "markedForCharity"
        }

        response = requests.post(f"{base_url}/api/listing", json=listing_data)
        print(f"Added listing {i + 1}: {response.status_code}")

def add_users(base_url):
    for user_id in user_ids:
        response = requests.post(f"{base_url}/api/user?user_id={user_id}")
        print(f"Added user {user_id}: {response.status_code}")

def add_random_interactions(base_url):
    # Add user click interactions 
    click_interactions = []
    for user_id in user_ids:
        click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
        click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
        
        for _ in range(2):
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(3):
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(4):
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
        
        for _ in range(5):
            click_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

    for interaction in click_interactions:
        response = requests.post(f"{base_url}/api/interactions/click", json=interaction)
        print(f"Recorded interaction for user {interaction['userID']} on listing {interaction['listingID']}: {response.status_code}")

    # Add user review interactions 
    review_interactions = []
    for user_id in user_ids:
        review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})
        review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})

        for _ in range(2):
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})

        for _ in range(3):
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})

        for _ in range(4):
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})

        for _ in range(5):
            review_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100)), "stars": random.randint(1, 5)})

    for interaction in review_interactions:
        response = requests.post(f"{base_url}/api/interactions/review", json=interaction)
        print(f"Recorded review for user {interaction['userID']} on listing {interaction['listingID']}: {response.status_code}")

    # Add user not interesting interactions 
    not_interesting_interactions = []
    for user_id in user_ids:
        not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
        not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(2):
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(3):
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(4):
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

        for _ in range(5):
            not_interesting_interactions.append({"userID": str(user_id), "listingID": str(random.randint(1, 100))})

    for interaction in not_interesting_interactions:
        response = requests.post(f"{base_url}/api/interactions/stop_recommending_item", json=interaction)
        print(f"Recorded not interesting interaction for user {interaction['userID']} on listing {interaction['listingID']}: {response.status_code}")

def add_manual_interactions(base_url):
    # Add user click interactions 
    click_interactions = [
        {"userID": user_ids[0], "listingID": "1"},
        {"userID": user_ids[0], "listingID": "2"},
        {"userID": user_ids[0], "listingID": "3"},
        {"userID": user_ids[0], "listingID": "4"},
        {"userID": user_ids[0], "listingID": "5"},
        {"userID": user_ids[0], "listingID": "6"},
        {"userID": user_ids[0], "listingID": "7"},
    ]

    for interaction in click_interactions:
        response = requests.post(f"{base_url}/api/interactions/click", json=interaction)
        print(f"Recorded interaction for user {interaction['userID']} on listing {interaction['listingID']}: {response.status_code}")

def get_recommendations(base_url, user_id):
    # Fetch recommendations for a user
    response = requests.get(f"{base_url}/api/recommendations?authUserID={user_id}", headers={"Authorization": f"Bearer {user_id}"})

    if response.status_code == 200:
        recommendations = response.json()
        print("Recommendations received:")
        print(json.dumps(recommendations, indent=2))
    else:
        print(f"Failed to get recommendations: {response.status_code}")

def main():
    base_url = "http://localhost:8004"
    add_listings(base_url)
    add_users(base_url)
    add_random_interactions(base_url)
    add_manual_interactions(base_url)

    print("Recommendations After Interactions")
    get_recommendations(base_url, user_ids[0])  # Set userID -> [random interaction IDs: 1-5] [manual interaction ID: manual1]

    print("LOOP")
    interaction = {"userID": "f1afc971-64ba-4f4c-8de5-edd2ac34393f", "listingID": "14"}
    for i in range(50):
        requests.post(f"{base_url}/api/interactions/click", json=interaction)

if __name__ == "__main__":
    main()
