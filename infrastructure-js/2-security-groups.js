{
  "Description": "This template contains the security groups required by our entire stack. We create them in a seperate nested template, so they can be referenced by all of the other nested templates.\n",
  "Parameters": {
    "EnvironmentName": {
      "Description": "An environment name that will be prefixed to resource names",
      "Type": "String"
    },
    "VPC": {
      "Type": "AWS::EC2::VPC::Id",
      "Description": "Choose which VPC the security groups should be deployed to"
    }
  },
  "Resources": {
    "ECSHostSecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "VpcId": { "Ref" : "VPC" },
        "GroupDescription": "Access to the ECS hosts and the tasks/containers that run on them",
        "SecurityGroupIngress": [
          {
            "SourceSecurityGroupId":  { "Ref" : "LoadBalancerSecurityGroup" },
            "IpProtocol": -1
          }
        ],
        "Tags": [
          {
            "Key": "Name",
            "Value": { "Fn::Sub" : "${EnvironmentName}-ECS-Hosts" }
          }
        ]
      }
    },
    "LoadBalancerSecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "VpcId": { "Ref" : "VPC" },
        "GroupDescription": "Access to the load balancer that sits in front of ECS",
        "SecurityGroupIngress": [
          {
            "CidrIp": "0.0.0.0/0",
            "IpProtocol": -1
          }
        ],
        "Tags": [
          {
            "Key": "Name",
            "Value":  { "Fn::Sub" : "${EnvironmentName}-LoadBalancers"}
          }
        ]
      }
    }
  },
  "Outputs": {
    "ECSHostSecurityGroup": {
      "Description": "A reference to the security group for ECS hosts",
      "Value": { "Ref" : "ECSHostSecurityGroup" }
    },
    "LoadBalancerSecurityGroup": {
      "Description": "A reference to the security group for load balancers",
      "Value": { "Ref" : "LoadBalancerSecurityGroup" }
    }
  }
}
