# webapp update 


# Packer Build for Assignment Application
=======

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