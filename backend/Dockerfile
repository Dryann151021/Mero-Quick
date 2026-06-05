FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile --production

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "bun run start"]
