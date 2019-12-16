import { App, Stack, StackProps, Tag } from '@aws-cdk/core'
import { AmazonLinuxImage, InstanceSize, InstanceType, PublicSubnet, SubnetType, Vpc } from '@aws-cdk/aws-ec2'
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2'
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling'

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          name: 'Empty',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 25,
          reserved: true
        },
        {
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
          // reserved: true
        },
        // {
        //   name: 'Private',
        //   subnetType: SubnetType.PRIVATE,
        //   cidrMask: 24
        // }
      ]
    })

    const selection = vpc.selectSubnets({
      subnetType: SubnetType.PUBLIC
    });

    /*
     * @see
     * https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ec2/lib/vpc.ts#L1158
     */
    // const publicSubnet = new PublicSubnet(this, 'PublicLLL', {
    //   availabilityZone: vpc.availabilityZones[0],
    //   cidrBlock: '10.0.1.0/24',
    //   vpcId: vpc.vpcId
    // })
    // vpc.publicSubnets.push(publicSubnet)


    const lb = new ApplicationLoadBalancer(this, 'PublicAlb', {
      vpc,
      internetFacing: true
    })

    const listener = lb.addListener('Listener', {
      port: 80,
      open: true
    })

    const asg = new AutoScalingGroup(this, 'TargetFleetAutoScalingGroup', {
      vpc,
      instanceType: new InstanceType(InstanceSize.SMALL),
      machineImage: new AmazonLinuxImage()
    })

    listener.addTargets('TargetFleetTg', {
      port: 8080,
      targets: [asg]
    })

    ;[
      vpc,
      lb,
      listener,
      asg
    ].forEach(construct => Tag.add(construct, 'Application', id))
  }
}
