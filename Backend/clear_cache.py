import asyncio
from redis import asyncio as aioredis
from app.core.config import settings

async def clear_redis_cache():
    """
    Connects to Redis using the URL from your .env file
    and deletes all keys.
    """
    print("--- Connecting to Redis... ---")
    try:
        # Create a client and connect
        redis = aioredis.from_url(str(settings.REDIS_URL))

        # Run the FLUSHALL command
        await redis.flushall()
        
        print("✅ Cache cleared successfully!")

        # Close the connection
        await redis.close()
        print("--- Connection closed. ---")

    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(clear_redis_cache())