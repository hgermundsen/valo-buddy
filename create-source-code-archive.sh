#!/bin/bash

zip -r source.zip .dockerignore .npmrc Dockerfile app build mocks package-lock.json package.json postcss.config.js prisma public remix.config.js remix.env.d.ts scripts server.ts tailwind.config.ts test tsconfig.json vitest.config.ts
