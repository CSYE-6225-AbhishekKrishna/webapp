packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" # Debian 12, us-east-1
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0c4fc48372ce54377"
}

variable "zip_file" {
  type    = string
  default = "/home/runner/work/webapp/webapp.zip"
}


source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"

  ami_regions = [
    "us-east-1",
  ]

  ami_users = [
    "635735244533",
    "047495291400",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 60
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdb"
    volume_size           = 8
    volume_type           = "gp2"
  }

}

build {
  name = "packer-build"
  sources = [
    "source.amazon-ebs.my-ami",
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "ZIP_FILE=${var.zip_file}"
    ]

    script = "scripts/build.sh"
  }

  provisioner "file" {
    source      = "${var.zip_file}"
    destination = "/home/webapp.zip"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
