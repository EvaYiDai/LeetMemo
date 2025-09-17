DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
    CREATE TYPE difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tag_type_enum') THEN
    CREATE TYPE tag_type_enum AS ENUM ('Topic', 'Company');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS problems (
  id           BIGSERIAL PRIMARY KEY,
  number       INTEGER NOT NULL UNIQUE,
  title        VARCHAR(255) NOT NULL UNIQUE,
  description  TEXT,
  link         TEXT,
  difficulty   difficulty_enum NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL UNIQUE,
  type        tag_type_enum NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problem_tags (
  id          BIGSERIAL PRIMARY KEY,
  problem_id  BIGINT NOT NULL,
  tag_id      BIGINT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT problem_id_fk
    FOREIGN KEY (problem_id) REFERENCES problems(id),
  CONSTRAINT tag_id_fk
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS users (
  id          BIGSERIAL PRIMARY KEY,
  first_name  VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  avatar_url  TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problem_progresses (
  id          BIGSERIAL PRIMARY KEY,
  problem_id  BIGINT NOT NULL,
  user_id     BIGINT NOT NULL,
  notes       TEXT,
  next_review TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT problem_progress_problem_id_fk
    FOREIGN KEY (problem_id) REFERENCES problems(id),
  CONSTRAINT problem_progress_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS entries (
  id                    BIGSERIAL PRIMARY KEY,
  problem_progress_id   BIGINT NOT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT entry_problem_progress_id_fk
    FOREIGN KEY (problem_progress_id) REFERENCES problem_progresses(id)
);

CREATE TABLE IF NOT EXISTS confidence_scores (
  id          BIGSERIAL PRIMARY KEY,
  entry_id    BIGINT NOT NULL,
  score       INTEGER NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT confidence_score_entry_id_fk
    FOREIGN KEY (entry_id) REFERENCES entries(id)
);

-- Auto-update updated_at on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
  trg_name TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'problems',
    'tags',
    'problem_tags',
    'users',
    'problem_progresses',
    'entries',
    'confidence_scores'
  ]
  LOOP
    trg_name := t || '_set_updated_at';
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I;', trg_name, t);
    EXECUTE format(
      'CREATE TRIGGER %I
         BEFORE UPDATE ON %I
         FOR EACH ROW
         EXECUTE FUNCTION set_updated_at();',
      trg_name, t
    );
  END LOOP;
END$$;

CREATE INDEX IF NOT EXISTS idx_problem_tags_problem_id ON problem_tags(problem_id);
CREATE INDEX IF NOT EXISTS idx_problem_tags_tag_id     ON problem_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_progresses_problem_id   ON problem_progresses(problem_id);
CREATE INDEX IF NOT EXISTS idx_progresses_user_id      ON problem_progresses(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_progress_id     ON entries(problem_progress_id);
CREATE INDEX IF NOT EXISTS idx_confidence_entry_id     ON confidence_scores(entry_id);
