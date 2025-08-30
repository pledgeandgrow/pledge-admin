CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,                 -- unique identifier
    title VARCHAR(255) NOT NULL,                 -- event name (Meeting, Deadline, etc.)
    description TEXT,                            -- optional details
    event_type VARCHAR(50),                      -- e.g., 'meeting', 'deadline', 'workshop'
    location VARCHAR(255),                       -- physical/virtual location (Zoom, office, etc.)
    
    start_datetime TIMESTAMP NOT NULL,           -- when event starts
    end_datetime TIMESTAMP,                      -- when event ends (can be null for deadlines)

    is_all_day BOOLEAN DEFAULT FALSE,            -- true if all-day event
    priority SMALLINT DEFAULT 0,                 -- e.g., 0=normal, 1=high, -1=low
    status VARCHAR(20) DEFAULT 'scheduled',      -- scheduled, completed, cancelled

    created_at TIMESTAMP DEFAULT NOW(),          -- auto timestamp
    updated_at TIMESTAMP DEFAULT NOW()
);