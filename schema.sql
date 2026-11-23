CREATE TABLE
    IF NOT EXISTS payments (
        id BIGSERIAL PRIMARY KEY,
        order_id TEXT NOT NULL UNIQUE,
        amount NUMERIC(12, 2) NOT NULL,
        currency TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );