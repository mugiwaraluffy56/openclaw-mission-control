terraform {
  required_version = ">= 1.6.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

variable "project_name" {
  type    = string
  default = "openclaw-mission-control"
}

resource "docker_network" "mission_control" {
  name = "${var.project_name}-net"
}
