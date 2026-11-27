FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY package.json pnpm-workspace.yaml .npmrc pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/catalog/package.json packages/catalog/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
COPY packages/catalog packages/catalog
RUN pnpm build

FROM postgres:17-alpine AS migrations
COPY db /db
USER postgres
ENTRYPOINT ["/bin/sh", "/db/migrate.sh"]

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
