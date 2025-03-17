#!/bin/sh

echo "migrating database"
npx prisma migrate deploy

echo "seeding database"
node prisma/seed.js