terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "region" { default = "eu-north-1" }
variable "instance_type" { default = "t3.small" }
variable "jwt_secret" { sensitive = true }

provider "aws" { region = var.region }

resource "aws_security_group" "clawdesk" {
  name = "clawdesk"
  ingress { from_port = 22;  to_port = 22;  protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 80;  to_port = 80;  protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 443; to_port = 443; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0;   to_port = 0;   protocol = "-1";  cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_instance" "clawdesk" {
  ami           = "ami-0c1ac8728ef7f3c26"
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.clawdesk.id]
  tags = { Name = "clawdesk" }
}

output "public_ip" { value = aws_instance.clawdesk.public_ip }
