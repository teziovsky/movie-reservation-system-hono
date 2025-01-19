FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
