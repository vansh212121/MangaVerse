from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlmodel import SQLModel
from app.db import base
from alembic import context

# This makes sure Alembic can find your 'app' module
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

# Import your models via the base file so Alembic can see them
from app.db import base
# Import your application's settings to get the database URL
from app.core.config import settings


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = SQLModel.metadata

# --- THIS IS THE CRUCIAL FIX ---
# We get the async URL from your app's settings...
async_db_url = str(settings.DATABASE_URL)
# ...and we create a synchronous version of it for Alembic to use.
sync_db_url = async_db_url.replace("+asyncpg", "")
# --- END OF FIX ---


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=sync_db_url,  # Use the sync url
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Create a configuration dictionary for the engine
    configuration = config.get_section(config.config_ini_section, {})
    # Set the URL to our synchronous URL
    configuration["sqlalchemy.url"] = sync_db_url
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
