# webapp update 



## Overview

This repository contains the Packer build configuration for Assignment Application. It automates the process of creating a custom Amazon Machine Image (AMI) for use in your AWS infrastructure.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- AWS account with necessary permissions.
- Packer installed on your local machine.
- Valid AWS credentials (either through AWS CLI configuration or environment variables).
- Customizations for your project (provisioners, configuration scripts, etc.).

## Getting Started

To get started with the Packer build, follow these steps:

1. Clone this repository to your local machine:

2. cd webapp

3. packer build ami.us-east-1.pkr.hcl

4. continue with your pulumi updates


## Commands to import the Certificate

1. openssl genrsa -out demoabhishekkrishnacloud.key 2048

2. openssl req -new -key demoabhishekkrishnacloud.key -out demoabhishekkrishnacloud.csr

3. aws acm import-certificate --certificate fileb://C:/Users/abhik/demo_abhishekkrishna.cloud/demo_abhishekkrishna_cloud.crt --private-key fileb://C:/Users/abhik/   demo_abhishekkrishna.cloud/privatekey.pem --certificate-chain fileb://C:/Users/abhik/demo_abhishekkrishna.cloud/demo_abhishekkrishna_cloud.ca-bundle