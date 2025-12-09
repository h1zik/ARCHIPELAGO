"""
Script to optimize existing image URLs by downloading and re-optimizing them
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import requests
from PIL import Image
import io
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

def optimize_image(image_bytes, max_width=1200, quality=80):
    """Optimize image from bytes"""
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert RGBA to RGB
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        if img.mode == 'RGBA':
            background.paste(img, mask=img.split()[-1])
        else:
            background.paste(img)
        img = background
    
    # Resize if too large
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
    
    # Save to bytes
    output = io.BytesIO()
    img.save(output, 'JPEG', quality=quality, optimize=True)
    return output.getvalue()

async def optimize_products():
    """Optimize product images"""
    products = await db.products.find({}).to_list(100)
    
    for product in products:
        if not product.get('image_url'):
            continue
            
        # Skip if already optimized (local URL)
        if '/api/uploads/' in product['image_url']:
            print(f"✓ {product['name']} - Already optimized")
            continue
        
        try:
            print(f"Processing {product['name']}...")
            
            # Download image
            response = requests.get(product['image_url'], timeout=10)
            if response.status_code != 200:
                print(f"  ✗ Failed to download")
                continue
            
            # Optimize
            optimized_bytes = optimize_image(response.content, max_width=800, quality=75)
            
            # Save
            filename = f"{uuid.uuid4()}.jpg"
            file_path = UPLOAD_DIR / filename
            with open(file_path, 'wb') as f:
                f.write(optimized_bytes)
            
            # Get file size
            size_kb = len(optimized_bytes) / 1024
            
            # Update database with relative path
            new_url = f"/api/uploads/{filename}"
            await db.products.update_one(
                {'id': product['id']},
                {'$set': {'image_url': new_url}}
            )
            
            print(f"  ✓ Optimized to {size_kb:.1f}KB - {new_url}")
            
        except Exception as e:
            print(f"  ✗ Error: {e}")

async def optimize_islands():
    """Optimize island images"""
    islands = await db.islands.find({}).to_list(100)
    
    for island in islands:
        if not island.get('image_url'):
            continue
            
        # Skip if already optimized
        if '/api/uploads/' in island['image_url']:
            print(f"✓ {island['name']} - Already optimized")
            continue
        
        try:
            print(f"Processing {island['name']}...")
            
            # Download image
            response = requests.get(island['image_url'], timeout=10)
            if response.status_code != 200:
                print(f"  ✗ Failed to download")
                continue
            
            # Optimize (larger for hero images)
            optimized_bytes = optimize_image(response.content, max_width=1600, quality=80)
            
            # Save
            filename = f"{uuid.uuid4()}.jpg"
            file_path = UPLOAD_DIR / filename
            with open(file_path, 'wb') as f:
                f.write(optimized_bytes)
            
            size_kb = len(optimized_bytes) / 1024
            
            # Update database
            new_url = f"/api/uploads/{filename}"
            await db.islands.update_one(
                {'id': island['id']},
                {'$set': {'image_url': new_url}}
            )
            
            print(f"  ✓ Optimized to {size_kb:.1f}KB - {new_url}")
            
        except Exception as e:
            print(f"  ✗ Error: {e}")

async def main():
    print("🖼️  Starting image optimization...\n")
    
    print("📦 Optimizing product images...")
    await optimize_products()
    
    print("\n🏝️  Optimizing island images...")
    await optimize_islands()
    
    print("\n✅ Optimization complete!")

if __name__ == "__main__":
    asyncio.run(main())
