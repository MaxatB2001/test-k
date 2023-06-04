CREATE USER task_manager WITH PASSWORD 'task_manager' CREATEDB;
CREATE DATABASE task_manager
    WITH
    OWNER = task_manager
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;