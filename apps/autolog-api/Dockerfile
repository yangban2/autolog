FROM node:22

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# 루트 패키지 설치용: 전체 복사
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 설치 전에 모든 패키지 복사 필요
COPY . .

RUN pnpm install --frozen-lockfile

# 빌드 실행
RUN pnpm build --filter=autolog-api...

CMD ["pnpm", "start", "--filter=autolog-api..."]
