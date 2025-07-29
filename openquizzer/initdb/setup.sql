-- Table: public.quizzes

-- DROP TABLE IF EXISTS public.quizzes;

CREATE TABLE IF NOT EXISTS public.quizzes
(
    id integer,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT false,
    userid integer,
    answer text COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    time_limit integer,
    difficulty integer NOT NULL DEFAULT 3,
    CONSTRAINT check_time_limit_range CHECK (time_limit IS NULL OR time_limit >= 0 AND time_limit <= 3600),
    CONSTRAINT check_difficulty_range CHECK (difficulty >= 1 AND difficulty <= 5)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.quizzes
    OWNER to postgres;

COMMENT ON COLUMN public.quizzes.time_limit
    IS 'Time limit for quiz in seconds. NULL means no time limit.';

COMMENT ON COLUMN public.quizzes.difficulty
    IS 'Difficulty level from 1 (Very Easy) to 5 (Very Hard). Default is 3 (Moderate).';