#!/bin/sh

ls

sudo apt-get install unzip -y
echo "===============================installed unzip==============================="

sudo apt-get install nodejs npm -y 
echo "===============================installed Node and NPM==============================="

sudo apt-get install postgresql postgresql-contrib -y 
echo "===============================installed unzip==============================="

sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Pa55w0rd';"
echo "===============================Passw0rd for user postgres changes==============================="

pwd