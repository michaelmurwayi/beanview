#!/bin/bash
set -e

echo "Waiting for MySQL to start..."
# Wait for MySQL service to be ready
until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

echo "Database is up! Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
gunicorn app.wsgi:application --bind 0.0.0.0:8000
