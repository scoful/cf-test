-- Migration: Initial schema for cf-test
-- Created: 2025-09-14

-- Create posts table
CREATE TABLE IF NOT EXISTS cf-test_post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT(256),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER
);

-- Create index on name column
CREATE INDEX IF NOT EXISTS name_idx ON cf-test_post(name);

-- Create events table for logging (optional)
CREATE TABLE IF NOT EXISTS cf-test_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    data TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Create index on events type and created_at
CREATE INDEX IF NOT EXISTS events_type_idx ON cf-test_events(type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON cf-test_events(created_at);
