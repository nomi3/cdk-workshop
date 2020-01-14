import { CfnAutoScalingGroup } from '@aws-cdk/aws-autoscaling'
import { App, Stack, StackProps } from '@aws-cdk/core'
import { CfnSecurityGroup, CfnSubnet, CfnVPC } from '@aws-cdk/aws-ec2'
import { CfnLoadBalancer, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2'

export declare interface ConstructProps {
  stack: Stack
  scope: App
  id: string
  props?: StackProps
}

export declare interface NetworkConstructs {
  vpc?: CfnVPC
  subnets: {
    public: CfnSubnet[]
  }
  loadBalancer: {
    elb?: CfnLoadBalancer
    sg?: CfnSecurityGroup
  }
  fleet: {
    asg?: CfnAutoScalingGroup
    sg?: CfnSecurityGroup
    tg?: CfnTargetGroup
  }
}
