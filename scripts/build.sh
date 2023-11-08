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
# sudo apt-get install postgresql -y
# if [ $? -eq 0 ]; then
#     echo "=============================== Installed PostgreSQL ==============================="
# else
#     echo "=============================== Failed to install PostgreSQL ==============================="
# fi

# sudo apt-get install postgresql-contrib -y
# if [ $? -eq 0 ]; then
#     echo "=============================== Installed PostgreSQL Contrib ==============================="
# else
#     echo "=============================== Failed to install PostgreSQL Contrib ==============================="
# fi

# Change the password for the 'postgres' user
# sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Pa55w0rd';"
# if [ $? -eq 0 ]; then
#     echo "=============================== Password for user 'postgres' changed ==============================="
# else
#     echo "=============================== Failed to change password for user 'postgres' ==============================="
# fi

# Print the current working directory
pwd
echo "=============================== List Here ==============================="
ls -al

# Unzip the webapp.zip file into the 'webapp' folder
# unzip -d webapp webapp.zip
sudo unzip -d /opt/csye6225/webapp webapp.zip
if [ $? -eq 0 ]; then
    echo "=============================== Unzipped webapp.zip into 'webapp' folder ==============================="
else
    echo "=============================== Failed to unzip webapp.zip ==============================="
fi

echo "=============================== unzip done ==============================="
pwd
ls -al

cd /opt/csye6225/webapp || exit

echo "=============================== List Here ==============================="
ls -al

# # Create and populate the .env file
# echo "PORT=3001" > .env
# echo "DB_DIALECT=postgres" >> .env
# echo "DB_DATABASE=postgres" >> .env
# echo "DB_PGPORT=5432" >> .env

# Create and populate the .env file with sudo
echo "Creating .env file"
sudo sh -c 'echo "PORT=3001" > .env
echo "DB_DIALECT=postgres" >> .env
echo "DB_DATABASE=postgres" >> .env
echo "DB_PGPORT=5432" >> .env'
echo ".env file created and populated"


echo "=============================== .env file created and populated ==============================="

# # Print the .env file
cat .env



# Systemd
echo "STARTING SYSTEMD COMMANDS"

# Copy the mywebapp.service file to /etc/systemd/system/
echo "Copying myapp-systemd.service file to /etc/systemd/system/"
sudo cp ./systemd/myapp-systemd.service /etc/systemd/system/

# Create group and user
echo "Creating group and user"
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

# Enable and start the service
echo "STARTING MYWEBAPP"
sudo systemctl enable myapp-systemd
sudo systemctl start myapp-systemd

sudo apt-get purge -y git

# echo "IN SHELL SCRIPT ----->  ZIP_FILE is: $ZIP_FILE"


sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E amazon-cloudwatch-agent.deb


# sudo mkdir /opt/aws/amazon-cloudwatch-agent
sudo mv ./cloudwatch/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
# sudo chmod 755 /opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json