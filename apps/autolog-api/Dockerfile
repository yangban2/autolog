FROM node:22

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY package.json ../../pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build --filter=autolog-api...

CMD ["pnpm", "start"]