#!/bin/sh

ls

# Update the package list to ensure we can install packages
sudo apt-get update

# Install 'unzip' package
sudo apt-get install unzip -y
echo "=============================== Installed unzip ==============================="

# Install 'nodejs' and 'npm' packages
sudo apt-get install nodejs -y
sudo apt-get install npm -y
echo "=============================== Installed Node and NPM ==============================="

# Install 'postgresql' and 'postgresql-contrib' packages
sudo apt-get install postgresql -y
sudo apt-get install postgresql-contrib -y
echo "=============================== Installed PostgreSQL and Contrib ==============================="

# Change the password for the 'postgres' user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Pa55w0rd';"
echo "=============================== Password for user 'postgres' changed ==============================="

# Print the current working directory
pwd
