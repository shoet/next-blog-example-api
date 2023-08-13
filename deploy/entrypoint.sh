#!/bin/sh
set -e

if [ -f ./prisma/sqlite.db ]; then
  rm ./prisma/sqlite.db*
fi

# Restore the database
litestream restore -v -if-replica-exists -o ./prisma/sqlite.db ${DB_REPLICA_REMOTE_PATH}

if [ -f ./prisma/sqlite.db ]; then
    echo "---- Restored from Cloud Storage ----"
else
    echo "---- Failed to restore from Cloud Storage ----"
    npx prisma generate
    npx prisma migrate deploy
    npx prisma db push
    npx prisma db seed
fi

# Run litestream with your app as the subprocess.
exec litestream replicate -exec "node ./dist/server.js" ./prisma/sqlite.db ${DB_REPLICA_REMOTE_PATH}
