# Go Picky Image

This is a simple image compression application based on [Next.js](https://nextjs.org) framework. The application allows users to upload an image, preview original and compressed versions, and receive a compressed image.

## Requirements

To run application, you need Docker installed. The following Docker version is used while developing:

```
docker 27.5.1
```

## Getting started

#### Create .env.dev file and set env variables

The `IMAGE_UPLOAD_DIR` and `DB_DATADIR` must be absolute paths.

```
# Absolute path to directory for storing uploaded images
IMAGE_UPLOAD_DIR=

DB_USER="user"
DB_HOST="database"
DB_PORT=5432
DB_PASSWORD="password"
DB_DATABASE="database_name"

# Absolute path to directory for storing database files
DB_DATADIR=
```

You do need to change `DB_HOST` as it uses docker compose service name.

#### Run docker containers

```bash
docker compose --env-file .env.dev -f docker/dev/compose.yaml up -d
```

#### Import schema.sql

Replace `<DB_USER>` and `<DB_DATABASE>` with values from .env.dev file.

```bash
docker compose --env-file .env.dev -f docker/dev/compose.yaml exec -T database psql -U <DB_USER> -d <DB_DATABASE> < schema.sql
```

Or use any GUI application to import schema.sql file

#### Running

The application should be available at `http://localhost:3001`

## Architecture

Every time a user opens the application, it generates a session ID that is stored until the user closes the browser tab. The session ID is used to create a directory for the current session, where compressed images are stored - this prevents image name collisions. Users can set the compression quality (default: 50%). For each quality level, the application creates a separate file:

```
IMAGE_UPLOAD_DIR/session_id/quality_filename.ext
```

If a user tries to compress the same image with the same quality, the application returns the previously compressed image.

In production environment uploaded images will be removed after 1 hour.

The application stores basic image compression information in the database, which can be used for analytics purposes.

## Improvements

- Allow users to upload multiple images at once
- Allow users to resize image
- Add support cloud store services (AWS S3, Cloudflare)
- Account creation to save image compression history
