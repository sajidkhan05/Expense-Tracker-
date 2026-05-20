KEYWORDS = {
    "Food": [
        "food", "restaurant", "cafe", "pizza", "burger", "lunch", "dinner",
        "breakfast", "snack", "grocery", "groceries", "swiggy", "zomato",
        "hotel", "eat", "meal", "chai", "tea", "coffee", "biryani", "bread",
        "milk", "vegetables", "fruits", "maggi", "noodles", "rice", "dal"
    ],
    "Transport": [
        "transport", "bus", "train", "auto", "rickshaw", "cab", "taxi",
        "uber", "ola", "fuel", "petrol", "diesel", "metro", "ticket",
        "travel", "fare", "toll", "parking", "bike", "rapido"
    ],
    "Shopping": [
        "shopping", "clothes", "shirt", "shoes", "amazon", "flipkart",
        "meesho", "myntra", "dress", "bag", "purchase", "store", "mall",
        "market", "online", "order", "delivery", "jeans", "accessories"
    ],
    "Bills": [
        "bill", "electricity", "water", "gas", "internet", "wifi",
        "broadband", "recharge", "mobile", "phone", "postpaid", "prepaid",
        "rent", "subscription", "netflix", "amazon prime", "hotstar",
        "insurance", "emi", "loan", "maintenance"
    ],
    "Health": [
        "health", "medicine", "medical", "doctor", "hospital", "clinic",
        "pharmacy", "chemist", "tablet", "injection", "test", "lab",
        "checkup", "dental", "eye", "gym", "fitness", "yoga"
    ],
    "Entertainment": [
        "entertainment", "movie", "cinema", "theatre", "game", "sport",
        "cricket", "football", "concert", "event", "party", "outing",
        "picnic", "trip", "tour", "holiday", "vacation", "fun", "bookmyshow"
    ],
    "Education": [
        "education", "book", "books", "course", "class", "tuition", "fee",
        "fees", "college", "school", "study", "stationery", "pen", "notebook",
        "exam", "coaching", "university", "library", "udemy", "coursera"
    ],
}

def suggest_category(description: str) -> str:
    text = description.lower()
    for category, keywords in KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                return category
    return "Other"