-- Create tables for KaiNo complying with Backend Technical Specifications and ElectricSQL supported types/constraints
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: admin_users (System Administration)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

-- Table: admin_credentials (Passkey Credentials)
CREATE TABLE IF NOT EXISTS admin_credentials (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    counter BIGINT NOT NULL DEFAULT 0,
    transports TEXT,
    created_at TIMESTAMPTZ NOT NULL
);

-- Table: lists (Shopping Lists)
CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

-- Table: list_items (Dynamic Shopping List Items)
CREATE TABLE IF NOT EXISTS list_items (
    id UUID PRIMARY KEY,
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity TEXT,
    price REAL,
    assigned_to TEXT,
    is_checked BOOLEAN NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Table: article_references (Global Learning Directory)
CREATE TABLE IF NOT EXISTS article_references (
    id UUID PRIMARY KEY,
    article_name TEXT NOT NULL,
    last_price REAL,
    suggested_category TEXT,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Electrify tables for synchronization via ElectricSQL
ALTER TABLE admin_users ENABLE ELECTRIC;
ALTER TABLE admin_credentials ENABLE ELECTRIC;
ALTER TABLE lists ENABLE ELECTRIC;
ALTER TABLE list_items ENABLE ELECTRIC;
ALTER TABLE article_references ENABLE ELECTRIC;
