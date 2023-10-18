#!/bin/sh

sleep 30
echo "=============================== List Here ==============================="
ls -al

# Update the package list to ensure we can install packages
sudo apt-get update

# Install 'unzip' package
sudo apt-get install unzip -y
if [ $? -eq 0 ]; then
    echo "=============================== Installed unzip ==============================="
else
    echo "=============================== Failed to install unzip ==============================="
fi

# Install 'nodejs' and 'npm' packages
sudo apt-get install nodejs -y
if [ $? -eq 0 ]; then
    echo "=============================== Installed Node ==============================="
else
    echo "=============================== Failed to install Node ==============================="
fi

sudo apt-get install npm -y
if [ $? -eq 0 ]; then
    echo "=============================== Installed NPM ==============================="
else
    echo "=============================== Failed to install NPM ==============================="
fi

# Install 'postgresql' and 'postgresql-contrib' packages
sudo apt-get install postgresql -y
if [ $? -eq 0 ]; then
    echo "=============================== Installed PostgreSQL ==============================="
else
    echo "=============================== Failed to install PostgreSQL ==============================="
fi

sudo apt-get install postgresql-contrib -y
if [ $? -eq 0 ]; then
    echo "=============================== Installed PostgreSQL Contrib ==============================="
else
    echo "=============================== Failed to install PostgreSQL Contrib ==============================="
fi

# Change the password for the 'postgres' user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Pa55w0rd';"
if [ $? -eq 0 ]; then
    echo "=============================== Password for user 'postgres' changed ==============================="
else
    echo "=============================== Failed to change password for user 'postgres' ==============================="
fi

# Print the current working directory
pwd
echo "=============================== List Here ==============================="
ls -al

unzip webapp.zip

echo "=============================== unzip done ==============================="
ls -al

cd webapp || exit
echo "=============================== List Here ==============================="
ls -al


# echo "IN SHELL SCRIPT ----->  ZIP_FILE is: $ZIP_FILE"

