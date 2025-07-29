-- OpenQuizzer Database Setup
-- This file creates all necessary tables for the application

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" UNIQUE NOT NULL,
    hash_password character varying(255) COLLATE pg_catalog."default",
    status boolean DEFAULT false,
    subs_id character varying(255) COLLATE pg_catalog."default",
    token_version integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Table: quizzes
-- DROP TABLE IF EXISTS quizzes;

CREATE TABLE IF NOT EXISTS quizzes
(
    id integer PRIMARY KEY,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'inactive',
    userid integer REFERENCES users(id) ON DELETE CASCADE,
    answer text COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    time_limit integer,
    difficulty integer NOT NULL DEFAULT 3,
    CONSTRAINT check_time_limit_range CHECK (time_limit IS NULL OR time_limit >= 0 AND time_limit <= 3600),
    CONSTRAINT check_difficulty_range CHECK (difficulty >= 1 AND difficulty <= 5)
);

-- Table: subscriptions
-- DROP TABLE IF EXISTS subscriptions;

CREATE TABLE IF NOT EXISTS subscriptions
(
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id character varying(255) COLLATE pg_catalog."default" UNIQUE NOT NULL,
    status character varying(50) COLLATE pg_catalog."default" DEFAULT 'active',
    current_period_start timestamp without time zone,
    current_period_end timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Table: answers
-- DROP TABLE IF EXISTS answers;

CREATE TABLE IF NOT EXISTS answers
(
    id SERIAL PRIMARY KEY,
    quiz_id integer REFERENCES quizzes(id) ON DELETE CASCADE,
    nickname character varying(100) COLLATE pg_catalog."default" NOT NULL,
    answer_text text COLLATE pg_catalog."default" NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    score numeric(5,2),
    feedback text COLLATE pg_catalog."default"
);