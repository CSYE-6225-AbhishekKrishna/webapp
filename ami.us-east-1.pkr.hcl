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

// variable "source_ami" {
//   // type    = string
//   // default = "ami-06db4d78cb1d3bbf9" # Debian 12, us-east-1


// }

variable "ssh_username" {
  type    = string
  default = "admin"
}

// variable "subnet_id" {
//   type    = string
//   default = "subnet-0c4fc48372ce54377"
// }

source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"

  source_ami_filter {
    filters = {
      name                = "debian-12-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
      architecture        = "x86_64"
    }
    most_recent = true
    owners      = ["aws-marketplace"]
  }

  ami_regions = [
    "us-east-1",
  ]

  ami_users = [
    "635735244533",
    "047495291400",
  ]

  // aws_polling {
  //   delay_seconds = 120
  //   max_attempts  = 60
  // }

  instance_type = "t2.micro"

  ssh_username = "${var.ssh_username}"

  // subnet_id     = "${var.subnet_id}"

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

  // provisioner "shell" {
  //   environment_vars = [
  //     "DEBIAN_FRONTEND=noninteractive",
  //     "CHECKPOINT_DISABLE=1",
  //     // "ZIP_FILE=${var.zip_file}"
  //   ]


  // }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/webapp.zip"
  }
  provisioner "shell" {
    script = "scripts/build.sh"
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
