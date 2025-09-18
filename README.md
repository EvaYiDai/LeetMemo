# LeetMemo
a personal LeetCode journey tracking project 

## Dev Setup

```bash
# Env files
cp db/.env.example db/.env 
# change user and password as needed

# Start Postgres
cd db
docker compose up -d

# Start Next.js
cd ../leetmemo-frontend
npm i
npm run dev
```