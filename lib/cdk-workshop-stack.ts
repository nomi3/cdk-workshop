import { App, Stack, StackProps, Tag, TagManager, CfnTag } from '@aws-cdk/core'
import { CfnVPC, CfnInternetGateway, CfnVPCGatewayAttachment, CfnSubnet, AmazonLinuxImage, InstanceSize, InstanceType, PublicSubnet, SubnetType, Vpc, Subnet } from '@aws-cdk/aws-ec2'
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2'
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling'

import genVpc from './constructs/vpc'

const commonTags = [
  {
    key: 'author',
    value: 'XXX XXX'
  }
]

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    genVpc(this, commonTags)



    // RouteTable
    // const publicRouteTable = new 


    // 以下は一旦コメントアウト
    // const lb = new ApplicationLoadBalancer(this, 'PublicAlb', {
    //   vpc,
    //   internetFacing: true
    // })

    // const listener = lb.addListener('Listener', {
    //   port: 80,
    //   open: true
    // })

    // const asg = new AutoScalingGroup(this, 'TargetFleetAutoScalingGroup', {
    //   vpc,
    //   instanceType: new InstanceType(InstanceSize.SMALL),
    //   machineImage: new AmazonLinuxImage()
    // })

    // listener.addTargets('TargetFleetTg', {
    //   port: 8080,
    //   targets: [asg]
    // })

    // ;[
    //   vpc,
    //   igw,
    //   // lb,
    //   // listener,
    //   // asg,
    //   // publicSubnet1
    // ].forEach(construct => Tag.add(construct, 'Application', id))
  }
}

