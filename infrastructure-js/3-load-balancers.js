{
  "Description": "This template deploys an Application Load Balancer that exposes our various ECS services. We create them it a seperate nested template, so it can be referenced by all of the other nested templates.\n",
  "Parameters": {
    "EnvironmentName": {
      "Description": "An environment name that will be prefixed to resource names",
      "Type": "String"
    },
    "VPC": {
      "Type": "AWS::EC2::VPC::Id",
      "Description": "Choose which VPC the Applicaion Load Balancer should be deployed to"
    },
    "Subnets": {
      "Description": "Choose which subnets the Applicaion Load Balancer should be deployed to",
      "Type": "List<AWS::EC2::Subnet::Id>"
    },
    "SecurityGroup": {
      "Description": "Select the Security Group to apply to the Applicaion Load Balancer",
      "Type": "AWS::EC2::SecurityGroup::Id"
    }
  },
  "Resources": {
    "LoadBalancer": {
      "Type": "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "Properties": {
        "Name": { "Ref" : "EnvironmentName" },
        "Subnets":  { "Ref" : "Subnets" },
        "SecurityGroups": [
           { "Ref" : "SecurityGroup" }
        ],
        "Tags": [
          {
            "Key": "Name",
            "Value": { "Ref" : "EnvironmentName" }
          }
        ]
      }
    },
    "LoadBalancerListener": {
      "Type": "AWS::ElasticLoadBalancingV2::Listener",
      "Properties": {
        "LoadBalancerArn": { "Ref" : "LoadBalancer" },
        "Port": 80,
        "Protocol": "HTTP",
        "DefaultActions": [
          {
            "Type": "forward",
            "TargetGroupArn":  { "Ref" : "DefaultTargetGroup" }
          }
        ]
      }
    },
    "DefaultTargetGroup": {
      "Type": "AWS::ElasticLoadBalancingV2::TargetGroup",
      "Properties": {
        "Name": "default",
        "VpcId": { "Ref" : "VPC" },
        "Port": 80,
        "Protocol": "HTTP"
      }
    }
  },
  "Outputs": {
    "LoadBalancer": {
      "Description": "A reference to the Application Load Balancer",
      "Value": { "Ref" : "LoadBalancer" }
    },
    "LoadBalancerUrl": {
      "Description": "The URL of the ALB",
      "Value": { "Fn::GetAtt" : [ "LoadBalancer", "DNSName" ] }
    },
    "Listener": {
      "Description": "A reference to a port 80 listener",
      "Value": { "Ref" : "LoadBalancerListener" }
    }
  }
}
