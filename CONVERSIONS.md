

### `GetAtt`
JSON
```
{ "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] }

"Fn::GetAtt" : [ "MyLB" , "DNSName" ]
```

YAML
```
!GetAtt logicalNameOfResource.attributeName
```



### `Ref`
JSON
```
{ "Ref" : "logicalName" }

"MyEIP" : {
   "Type" : "AWS::EC2::EIP",
   "Properties" : {
      "InstanceId" : { "Ref" : "MyEC2Instance" }
   }
}
```

YAML
```
!Ref logicalName
```

### `Fn::Join`
JSON
```
{ "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] }

"Fn::Join" : [ ":", [ "a", "b", "c" ] ]
```

YAML
```
!Join [ delimiter, [ comma-delimited list of values ] ]
```


### `Fn::Select`
The intrinsic function Fn::Select returns a single object from a list of objects by index.

JSON
```
{ "Fn::Select" : [ index, listOfObjects ] }

{ "Fn::Select" : [ "1", [ "apples", "grapes", "oranges", "mangoes" ] ] }
```

YAML
```
!Select [ index, listOfObjects ]
```


### `Fn::GetAZs`
The intrinsic function Fn::GetAZs returns an array that lists Availability Zones for a specified region. Because customers have access to different Availability Zones, the intrinsic function Fn::GetAZs enables template authors to write templates that adapt to the calling user's access. That way you don't have to hard-code a full list of Availability Zones for a specified region.

JSON
```
{ "Fn::GetAZs" : "region" }

[ "us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d" ]
```

YAML
```
!GetAZs region
```


### `Fn::Sub`
The intrinsic function Fn::Sub substitutes variables in an input string with values that you specify. In your templates, you can use this function to construct commands or outputs that include values that aren't available until you create or update a stack.

JSON
```
{ "Fn::Sub" : [ String, { Var1Name: Var1Value, Var2Name: Var2Value } ] }

"UserData": { "Fn::Base64": { "Fn::Join": ["\n", [
  "#!/bin/bash -xe",
  "yum update -y aws-cfn-bootstrap",
  { "Fn::Sub": "/opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource LaunchConfig --configsets wordpress_install --region ${AWS::Region}" },
  { "Fn::Sub": "/opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --stack ${AWS::StackName} --resource WebServer --region ${AWS::Region}" }]]
}}

{ "Fn::Sub": [ "www.${Domain}", { "Domain": {"Ref" : "RootDomainName" }} ]}
```

YAML
```
!Sub
  - String
  - { Var1Name: Var1Value, Var2Name: Var2Value }
```


### `Fn::FindInMap`
The intrinsic function Fn::FindInMap returns the value corresponding to keys in a two-level map that is declared in the Mappings section.


JSON
```
{ "Fn::FindInMap" : [ "MapName", "TopLevelKey", "SecondLevelKey"] }

{
  ...
  "Mappings" : {
    "RegionMap" : {
      "us-east-1" : { "32" : "ami-6411e20d", "64" : "ami-7a11e213" },
      "us-west-1" : { "32" : "ami-c9c7978c", "64" : "ami-cfc7978a" },
      "eu-west-1" : { "32" : "ami-37c2f643", "64" : "ami-31c2f645" },
      "ap-southeast-1" : { "32" : "ami-66f28c34", "64" : "ami-60f28c32" },
      "ap-northeast-1" : { "32" : "ami-9c03a89d", "64" : "ami-a003a8a1" }
    }
  },

  "Resources" : {
     "myEC2Instance" : {
        "Type" : "AWS::EC2::Instance",
        "Properties" : {
           "ImageId" : { "Fn::FindInMap" : [ "RegionMap", { "Ref" : "AWS::Region" }, "32"]},
           "InstanceType" : "m1.small"
        }
     }
 }
}
```

YAML
```
!FindInMap [ MapName, TopLevelKey, SecondLevelKey ]
```


### ``
JSON
```
```

YAML
```
```


### ``
JSON
```
```

YAML
```
```


### ``
JSON
```
```

YAML
```
```


### ``
JSON
```
```

YAML
```
```


### ``
JSON
```
```

YAML
```
```
