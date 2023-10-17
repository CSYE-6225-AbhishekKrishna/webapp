#!/bin/sh

# ls

# # Update the package list to ensure we can install packages
# sudo apt-get update

# # Install 'unzip' package
# sudo apt-get install unzip -y
# echo "=============================== Installed unzip ==============================="

# # Install 'nodejs' and 'npm' packages
# sudo apt-get install nodejs -y
# sudo apt-get install npm -y
# echo "=============================== Installed Node and NPM ==============================="

# # Install 'postgresql' and 'postgresql-contrib' packages
# sudo apt-get install postgresql -y
# sudo apt-get install postgresql-contrib -y
# echo "=============================== Installed PostgreSQL and Contrib ==============================="

# # Change the password for the 'postgres' user
# sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Pa55w0rd';"
# echo "=============================== Password for user 'postgres' changed ==============================="

# # Print the current working directory
# pwd


ls

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


echo "IN SHELL SCRIPT ----->  ZIP_FILE is: $ZIP_FILE"

