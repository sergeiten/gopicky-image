CREATE SEQUENCE IF NOT EXISTS uploads_id_seq;

CREATE TABLE "uploads" (
    "id" int4 NOT NULL DEFAULT nextval('uploads_id_seq'::regclass),
    "session_id" varchar(16) NOT NULL,
    "file_name" varchar,
    "file_ext" varchar,
    "file_size" int8,
    "compressed_quality" int2,
    "compressed_size" int8,
    "created_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
