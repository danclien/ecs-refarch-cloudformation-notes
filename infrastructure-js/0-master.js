{
  "Description": "\nThis template deploys a VPC, with a pair of public and private subnets spread  across two Availabilty Zones. It deploys an Internet Gateway, with a default  route on the public subnets. It deploys a pair of NAT Gateways (one in each AZ),  and default routes for them in the private subnets.\nIt then deploys a highly available ECS cluster using an AutoScaling Group, with  ECS hosts distributed across multiple Availability Zones. \nFinally, it deploys a pair of example ECS services from containers published in  Amazon EC2 Container Registry (Amazon ECR).\nLast Modified: 22nd September 2016 Author: Paul Maddox <pmaddox@amazon.com>\n",
  "Resources": {
    "VPC": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/infrastructure/vpc.yaml",
        "Parameters": {
          "EnvironmentName": "AWS::StackName",
          "VpcCIDR": "10.180.0.0/16",
          "PublicSubnet1CIDR": "10.180.8.0/21",
          "PublicSubnet2CIDR": "10.180.16.0/21",
          "PrivateSubnet1CIDR": "10.180.24.0/21",
          "PrivateSubnet2CIDR": "10.180.32.0/21"
        }
      }
    },
    "SecurityGroups": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/infrastructure/security-groups.yaml",
        "Parameters": {
          "EnvironmentName": "AWS::StackName",
          "VPC": "VPC.Outputs.VPC"
        }
      }
    },
    "ALB": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/infrastructure/load-balancers.yaml",
        "Parameters": {
          "EnvironmentName": "AWS::StackName",
          "VPC": "VPC.Outputs.VPC",
          "Subnets": "VPC.Outputs.PublicSubnets",
          "SecurityGroup": "SecurityGroups.Outputs.LoadBalancerSecurityGroup"
        }
      }
    },
    "ECS": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/infrastructure/ecs-cluster.yaml",
        "Parameters": {
          "EnvironmentName": "AWS::StackName",
          "InstanceType": "t2.large",
          "ClusterSize": 4,
          "VPC": "VPC.Outputs.VPC",
          "SecurityGroup": "SecurityGroups.Outputs.ECSHostSecurityGroup",
          "Subnets": "VPC.Outputs.PrivateSubnets"
        }
      }
    },
    "ProductService": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/services/product-service/service.yaml",
        "Parameters": {
          "VPC": "VPC.Outputs.VPC",
          "Cluster": "ECS.Outputs.Cluster",
          "DesiredCount": 2,
          "Listener": "ALB.Outputs.Listener",
          "Path": "/products"
        }
      }
    },
    "WebsiteService": {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://s3.amazonaws.com/ecs-refarch-cloudformation/services/website-service/service.yaml",
        "Parameters": {
          "VPC": "VPC.Outputs.VPC",
          "Cluster": "ECS.Outputs.Cluster",
          "DesiredCount": 2,
          "ProductServiceUrl": [
            "/",
            [
              "ALB.Outputs.LoadBalancerUrl",
              "products"
            ]
          ],
          "Listener": "ALB.Outputs.Listener",
          "Path": "/"
        }
      }
    }
  },
  "Outputs": {
    "ProductServiceUrl": {
      "Description": "The URL endpoint for the product service",
      "Value": [
        "/",
        [
          "ALB.Outputs.LoadBalancerUrl",
          "products"
        ]
      ]
    },
    "WebsiteServiceUrl": {
      "Description": "The URL endpoint for the website service",
      "Value": [
        "",
        [
          "ALB.Outputs.LoadBalancerUrl",
          "/"
        ]
      ]
    }
  }
}
