-- Sample problems
INSERT INTO problems (number, title, difficulty, description, link)
VALUES
  (1, 'Two Sum', 'Easy', 'Find indices of two numbers that add up to target', 'https://leetcode.com/problems/two-sum/'),
  (2, 'Add Two Numbers', 'Medium', 'Add two numbers represented as linked lists', 'https://leetcode.com/problems/add-two-numbers/')
ON CONFLICT (number) DO NOTHING;

-- Sample tags
INSERT INTO tags (name, type) VALUES
  ('Array', 'Topic'),
  ('Linked List', 'Topic'),
  ('Google', 'Company')
ON CONFLICT (name) DO NOTHING;

-- Problem ↔ Tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id
FROM problems p, tags t
WHERE p.number = 1 AND t.name = 'Array'
ON CONFLICT DO NOTHING;

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id
FROM problems p, tags t
WHERE p.number = 1 AND t.name = 'Google'
ON CONFLICT DO NOTHING;

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id
FROM problems p, tags t
WHERE p.number = 2 AND t.name = 'Linked List'
ON CONFLICT DO NOTHING;

-- Sample users
INSERT INTO users (first_name, last_name, email)
VALUES
  ('Alice', 'Dev', 'alice@example.com'),
  ('Bob', 'Tester', 'bob@example.com')
ON CONFLICT (email) DO NOTHING;

-- Sample progress
INSERT INTO problem_progresses (problem_id, user_id, notes, next_review)
SELECT p.id, u.id, 'First attempt', now() + interval '7 days'
FROM problems p, users u
WHERE p.number = 1 AND u.email = 'alice@example.com'
ON CONFLICT DO NOTHING;

-- Entries + confidence
INSERT INTO entries (problem_progress_id)
SELECT pp.id
FROM problem_progresses pp
JOIN users u ON pp.user_id = u.id
WHERE u.email = 'alice@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO confidence_scores (entry_id, score)
SELECT e.id, 3
FROM entries e
JOIN problem_progresses pp ON e.problem_progress_id = pp.id
JOIN users u ON pp.user_id = u.id
WHERE u.email = 'alice@example.com'
ON CONFLICT DO NOTHING;
