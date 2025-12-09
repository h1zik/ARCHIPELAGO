import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Seed data for 6 islands
islands_data = [
    {
        "id": "island_buton",
        "name": "Buton",
        "slug": "buton",
        "story": "Di hutan lebat Buton, kabut pagi membawa aroma resin dan lumut. Tanah vulkanik yang subur menumbuhkan vetiver liar dan paku-pakuan raksasa. Aroma ini adalah napas dari kedalaman bumi—gelap, mistis, dan penuh kehidupan.",
        "mood": "Mystical, Grounded, Earthy",
        "aroma_notes": {
            "top": ["Bergamot", "Green Leaves"],
            "heart": ["Vetiver", "Cedarwood", "Moss"],
            "base": ["Patchouli", "Amber", "Musk"]
        },
        "image_url": "https://images.unsplash.com/photo-1695632646657-2ca8100fd6ee?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "island_sumba",
        "name": "Sumba",
        "slug": "sumba",
        "story": "Padang sabana Sumba terbentang luas di bawah langit terbuka. Angin membawa aroma rumput kering, kayu cendana, dan debu tanah merah. Ini adalah kebebasan dalam setiap hembusan—liar, hangat, dan tanpa batas.",
        "mood": "Wild, Warm, Free",
        "aroma_notes": {
            "top": ["Cardamom", "Pink Pepper"],
            "heart": ["Sandalwood", "Tobacco Leaf", "Leather"],
            "base": ["Vanilla", "Cedarwood", "Tonka Bean"]
        },
        "image_url": "https://images.unsplash.com/photo-1664889050657-5ec9abd9ca00?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "island_alor",
        "name": "Alor",
        "slug": "alor",
        "story": "Laut dalam Alor menyimpan rahasia dalam biru safirnya. Aroma garam laut berpadu dengan bunga frangipani yang jatuh di pasir vulkanik hitam. Setiap gelombang membawa cerita dari kedalaman—tenang, dalam, dan penuh misteri.",
        "mood": "Deep, Marine, Tranquil",
        "aroma_notes": {
            "top": ["Sea Salt", "Citrus", "Ozone"],
            "heart": ["Frangipani", "Jasmine", "Driftwood"],
            "base": ["Ambergris", "Musk", "Vetiver"]
        },
        "image_url": "https://images.unsplash.com/photo-1633064017654-7008f7460762?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "island_komodo",
        "name": "Komodo",
        "slug": "komodo",
        "story": "Pulau Komodo adalah tanah prasejarah yang masih hidup. Batu panas, tanah kering, dan aroma resin dari pohon lontar menciptakan lanskap yang keras namun megah. Ini adalah kekuatan purba yang mengalir dalam setiap tarikan napas.",
        "mood": "Prehistoric, Powerful, Raw",
        "aroma_notes": {
            "top": ["Black Pepper", "Ginger"],
            "heart": ["Leather", "Oud", "Incense"],
            "base": ["Amber", "Smoke", "Patchouli"]
        },
        "image_url": "https://images.unsplash.com/photo-1624336887379-da6b45b5f9ad?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "island_nias",
        "name": "Nias",
        "slug": "nias",
        "story": "Nias adalah pulau batu megalitik dan tradisi pejuang. Aroma kayu wangi terbakar dalam ritual, dicampur dengan kelapa dan vanila dari hutan tropis. Ini adalah kekuatan yang lembut—berani namun hangat, kukuh namun manusiawi.",
        "mood": "Warrior Spirit, Warm, Sacred",
        "aroma_notes": {
            "top": ["Coconut", "Lime"],
            "heart": ["Frangipani", "Ylang-Ylang", "Clove"],
            "base": ["Vanilla", "Sandalwood", "Benzoin"]
        },
        "image_url": "https://images.unsplash.com/photo-1567461006814-9dafe04668c6?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "island_papua",
        "name": "Papua",
        "slug": "papua",
        "story": "Papua adalah surga terakhir—hutan hujan yang tak tersentuh, burung cendrawasih yang terbang di antara kabut, dan aroma bunga anggrek liar. Setiap sudut adalah keajaiban alam yang masih murni. Ini adalah kebebasan sejati dalam bentuk aromanya.",
        "mood": "Paradise, Exotic, Untouched",
        "aroma_notes": {
            "top": ["Mandarin", "Black Currant", "Lychee"],
            "heart": ["Orchid", "Jasmine", "Bird of Paradise Flower"],
            "base": ["Musk", "Amber", "Vanilla"]
        },
        "image_url": "https://images.unsplash.com/photo-1724227071836-8ca18287e2b7?crop=entropy&cs=srgb&fm=jpg&q=85",
        "created_at": "2025-01-01T00:00:00Z"
    }
]

# Seed products
products_data = [
    {
        "id": "prod_buton_50ml",
        "name": "Buton Eau de Parfum",
        "island_id": "island_buton",
        "island_name": "Buton",
        "price": 850000,
        "stock": 50,
        "size": "50ml",
        "description": "Eau de Parfum yang terinspirasi dari hutan mistis Buton. Vetiver dan patchouli menciptakan aroma earthy yang dalam dan menenangkan.",
        "aroma_notes": {
            "top": ["Bergamot", "Green Leaves"],
            "heart": ["Vetiver", "Cedarwood", "Moss"],
            "base": ["Patchouli", "Amber", "Musk"]
        },
        "olfactive_family": "Woody Aromatic",
        "mood": "Mystical, Grounded",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/y6oiucty_Artboard%201.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_sumba_50ml",
        "name": "Sumba Eau de Parfum",
        "island_id": "island_sumba",
        "island_name": "Sumba",
        "price": 850000,
        "stock": 50,
        "size": "50ml",
        "description": "Kehangatan sabana Sumba dalam botol. Sandalwood dan vanilla menciptakan aroma yang lembut namun kuat.",
        "aroma_notes": {
            "top": ["Cardamom", "Pink Pepper"],
            "heart": ["Sandalwood", "Tobacco Leaf", "Leather"],
            "base": ["Vanilla", "Cedarwood", "Tonka Bean"]
        },
        "olfactive_family": "Oriental Spicy",
        "mood": "Warm, Free",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/bxew3p1b_Artboard%201%20copy%202.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_alor_50ml",
        "name": "Alor Eau de Parfum",
        "island_id": "island_alor",
        "island_name": "Alor",
        "price": 850000,
        "stock": 50,
        "size": "50ml",
        "description": "Kedalaman laut Alor ditangkap dalam aroma marine yang segar dan misterius. Sea salt dan frangipani berpadu sempurna.",
        "aroma_notes": {
            "top": ["Sea Salt", "Citrus", "Ozone"],
            "heart": ["Frangipani", "Jasmine", "Driftwood"],
            "base": ["Ambergris", "Musk", "Vetiver"]
        },
        "olfactive_family": "Aquatic Floral",
        "mood": "Deep, Tranquil",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/cw8vuegc_Artboard%201%20copy.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_komodo_50ml",
        "name": "Komodo Eau de Parfum",
        "island_id": "island_komodo",
        "island_name": "Komodo",
        "price": 950000,
        "stock": 40,
        "size": "50ml",
        "description": "Kekuatan prasejarah Komodo dalam aroma yang kuat dan maskulin. Oud dan leather menciptakan signature yang tak terlupakan.",
        "aroma_notes": {
            "top": ["Black Pepper", "Ginger"],
            "heart": ["Leather", "Oud", "Incense"],
            "base": ["Amber", "Smoke", "Patchouli"]
        },
        "olfactive_family": "Leather Oud",
        "mood": "Powerful, Raw",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/y6oiucty_Artboard%201.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_nias_50ml",
        "name": "Nias Eau de Parfum",
        "island_id": "island_nias",
        "island_name": "Nias",
        "price": 850000,
        "stock": 50,
        "size": "50ml",
        "description": "Kehangatan spiritual Nias. Vanilla dan frangipani menciptakan aroma yang berani namun lembut.",
        "aroma_notes": {
            "top": ["Coconut", "Lime"],
            "heart": ["Frangipani", "Ylang-Ylang", "Clove"],
            "base": ["Vanilla", "Sandalwood", "Benzoin"]
        },
        "olfactive_family": "Tropical Floral",
        "mood": "Warm, Sacred",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/bxew3p1b_Artboard%201%20copy%202.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_papua_50ml",
        "name": "Papua Eau de Parfum",
        "island_id": "island_papua",
        "island_name": "Papua",
        "price": 950000,
        "stock": 40,
        "size": "50ml",
        "description": "Surga Papua dalam botol. Orchid dan jasmine menciptakan aroma floral yang eksotis dan memukau.",
        "aroma_notes": {
            "top": ["Mandarin", "Black Currant", "Lychee"],
            "heart": ["Orchid", "Jasmine", "Bird of Paradise Flower"],
            "base": ["Musk", "Amber", "Vanilla"]
        },
        "olfactive_family": "Floral Fruity",
        "mood": "Exotic, Paradise",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/cw8vuegc_Artboard%201%20copy.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "prod_discovery_set",
        "name": "Archipelago Discovery Set",
        "island_id": "all",
        "island_name": "All Islands",
        "price": 450000,
        "stock": 100,
        "size": "6 x 5ml",
        "description": "Jelajahi keenam pulau dalam satu set. 6 vial @ 5ml dari setiap varian untuk menemukan signature scent Anda.",
        "aroma_notes": {
            "top": ["Various"],
            "heart": ["Various"],
            "base": ["Various"]
        },
        "olfactive_family": "Discovery Set",
        "mood": "Exploratory",
        "image_url": "https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/bxew3p1b_Artboard%201%20copy%202.png",
        "reviews": [],
        "created_at": "2025-01-01T00:00:00Z"
    }
]

# Quiz data
quiz_data = {
    "id": "quiz_config",
    "questions": [
        {
            "id": "q1",
            "question": "Suasana seperti apa yang paling Anda sukai?",
            "options": [
                {
                    "text": "Hutan mistis dan tenang",
                    "island_weights": {"island_buton": 3, "island_papua": 1}
                },
                {
                    "text": "Padang terbuka yang luas",
                    "island_weights": {"island_sumba": 3, "island_komodo": 1}
                },
                {
                    "text": "Pantai dan laut dalam",
                    "island_weights": {"island_alor": 3, "island_papua": 1}
                },
                {
                    "text": "Desa tradisional yang hangat",
                    "island_weights": {"island_nias": 3, "island_sumba": 1}
                }
            ]
        },
        {
            "id": "q2",
            "question": "Aroma apa yang paling Anda suka?",
            "options": [
                {
                    "text": "Kayu dan tanah (woody, earthy)",
                    "island_weights": {"island_buton": 3, "island_sumba": 2}
                },
                {
                    "text": "Bunga dan segar (floral, fresh)",
                    "island_weights": {"island_papua": 3, "island_alor": 2, "island_nias": 1}
                },
                {
                    "text": "Pedas dan oriental (spicy, oriental)",
                    "island_weights": {"island_komodo": 3, "island_sumba": 2}
                },
                {
                    "text": "Laut dan ozon (marine, aquatic)",
                    "island_weights": {"island_alor": 3, "island_papua": 1}
                }
            ]
        },
        {
            "id": "q3",
            "question": "Kepribadian Anda lebih condong ke?",
            "options": [
                {
                    "text": "Tenang, introspektif, misterius",
                    "island_weights": {"island_buton": 3, "island_alor": 1}
                },
                {
                    "text": "Bebas, petualang, spontan",
                    "island_weights": {"island_sumba": 3, "island_papua": 2}
                },
                {
                    "text": "Kuat, berani, percaya diri",
                    "island_weights": {"island_komodo": 3, "island_nias": 2}
                },
                {
                    "text": "Hangat, spiritual, bijaksana",
                    "island_weights": {"island_nias": 3, "island_buton": 1}
                }
            ]
        },
        {
            "id": "q4",
            "question": "Waktu favorit Anda dalam sehari?",
            "options": [
                {
                    "text": "Pagi hari dengan kabut",
                    "island_weights": {"island_buton": 2, "island_papua": 2}
                },
                {
                    "text": "Siang hari yang cerah",
                    "island_weights": {"island_sumba": 3, "island_alor": 2}
                },
                {
                    "text": "Sore menjelang malam",
                    "island_weights": {"island_komodo": 2, "island_nias": 2}
                },
                {
                    "text": "Malam dengan bintang",
                    "island_weights": {"island_alor": 2, "island_papua": 2}
                }
            ]
        }
    ],
    "updated_at": "2025-01-01T00:00:00Z"
}

# FAQ data
faq_data = [
    {
        "id": "faq_1",
        "question": "Apakah Archipelago Scent menggunakan bahan alami?",
        "answer": "Ya, kami menggunakan kombinasi ekstrak alami Indonesia dan molekul sintetis berkualitas tinggi yang aman dan tahan lama.",
        "order": 1,
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "faq_2",
        "question": "Berapa lama ketahanan aromanya?",
        "answer": "Eau de Parfum kami memiliki konsentrasi 15-20% yang bertahan 6-8 jam di kulit.",
        "order": 2,
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "faq_3",
        "question": "Bagaimana cara memilih varian yang tepat?",
        "answer": "Anda bisa menggunakan Scent Finder Quiz kami atau mencoba Discovery Set yang berisi semua varian.",
        "order": 3,
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "faq_4",
        "question": "Apakah ada kebijakan pengembalian?",
        "answer": "Kami menerima retur dalam 14 hari untuk produk yang belum dibuka dengan kondisi kemasan utuh.",
        "order": 4,
        "created_at": "2025-01-01T00:00:00Z"
    },
    {
        "id": "faq_5",
        "question": "Apakah produk cruelty-free?",
        "answer": "Ya, semua produk Archipelago Scent adalah cruelty-free dan tidak diuji pada hewan.",
        "order": 5,
        "created_at": "2025-01-01T00:00:00Z"
    }
]

# Theme settings
theme_data = {
    "id": "theme_settings",
    "primary_color": "#2C3639",
    "secondary_color": "#DCD7C9",
    "accent_color": "#A27B5C",
    "hero_images": [
        "https://images.unsplash.com/photo-1637060548964-f064b88cd344?crop=entropy&cs=srgb&fm=jpg&q=85",
        "https://images.unsplash.com/photo-1624336887379-da6b45b5f9ad?crop=entropy&cs=srgb&fm=jpg&q=85",
        "https://images.unsplash.com/photo-1664889050657-5ec9abd9ca00?crop=entropy&cs=srgb&fm=jpg&q=85"
    ],
    "updated_at": "2025-01-01T00:00:00Z"
}

async def seed_database():
    print("🌱 Starting database seed...")
    
    # Clear existing data
    print("Clearing existing collections...")
    await db.islands.delete_many({})
    await db.products.delete_many({})
    await db.quiz.delete_many({})
    await db.faq.delete_many({})
    await db.theme.delete_many({})
    
    # Insert islands
    print(f"Inserting {len(islands_data)} islands...")
    await db.islands.insert_many(islands_data)
    
    # Insert products
    print(f"Inserting {len(products_data)} products...")
    await db.products.insert_many(products_data)
    
    # Insert quiz
    print("Inserting quiz configuration...")
    await db.quiz.insert_one(quiz_data)
    
    # Insert FAQs
    print(f"Inserting {len(faq_data)} FAQ items...")
    await db.faq.insert_many(faq_data)
    
    # Insert theme
    print("Inserting theme settings...")
    await db.theme.insert_one(theme_data)
    
    print("\n✅ Database seeded successfully!")
    print("\n📊 Summary:")
    print(f"   - Islands: {len(islands_data)}")
    print(f"   - Products: {len(products_data)}")
    print(f"   - Quiz Questions: {len(quiz_data['questions'])}")
    print(f"   - FAQs: {len(faq_data)}")
    print("   - Theme: Configured")
    print("\n💡 Next step: Create admin user via /api/auth/register")
    print("   Example: POST /api/auth/register")
    print("   Body: {\"username\": \"admin\", \"email\": \"admin@archipelago.com\", \"password\": \"admin123\"}")

if __name__ == "__main__":
    try:
        asyncio.run(seed_database())
    except KeyboardInterrupt:
        print("\n\n⚠️  Seeding interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error during seeding: {e}")
        sys.exit(1)
