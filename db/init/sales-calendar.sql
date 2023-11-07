CREATE TABLE sales.calendar_event (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    event_description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    all_day BOOLEAN,
    rrule TEXT
);