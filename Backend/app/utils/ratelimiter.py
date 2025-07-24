import asyncio
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, max_requests=3, time_window=1):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    async def acquire(self):
        now = datetime.now()
        # Remove requests older than time_window
        self.requests = [req_time for req_time in self.requests 
                        if now - req_time < timedelta(seconds=self.time_window)]
        
        if len(self.requests) >= self.max_requests:
            sleep_time = self.time_window - (now - self.requests[0]).total_seconds()
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)
        
        self.requests.append(now)

# Create a global rate limiter
rate_limiter = RateLimiter(max_requests=3, time_window=1)

async def _make_request(endpoint: str, params: dict = None):
    await rate_limiter.acquire()  # Add this line
    # Your existing _make_request code here