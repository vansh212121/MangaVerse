from fastapi import FastAPI, Request
from app.core.logging_config import setup_logging
import logging
from app.core.config import settings
from starlette.middleware.cors import CORSMiddleware
import time
from app.api.v1.endpoints import user, manga, authentication

# Call the setup function to apply our logging config
setup_logging()
logger = logging.getLogger("default")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log incoming requests, including path, method, and processing time.
    """
    start_time = time.time()
    logger.info(f"Request: {request.method} {request.url.path}")
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = '{0:.2f}'.format(process_time)
    logger.info(f"Response: {response.status_code} - Completed in {formatted_process_time}ms")
    
    return response

app.include_router(authentication.router, prefix=settings.API_V1_STR)
app.include_router(user.router, prefix=settings.API_V1_STR)
app.include_router(manga.router, prefix=settings.API_V1_STR)

# Add CORS middleware (you can configure this more strictly later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple root endpoint to test everything is working
@app.get("/")
def read_root():
    logger.info("Root endpoint was called.")
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
