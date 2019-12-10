import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { SubnetType, Vpc } from '@aws-cdk/aws-ec2'
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import autoscaling = require('@aws-cdk/aws-autoscaling');

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet1',
          subnetType: SubnetType.PUBLIC,
        },
      ],
    })

    const lb = new elbv2.ApplicationLoadBalancer(this, 'PublicAlb', {
        vpc,
        internetFacing: true
    })

    const listener = lb.addListener('Listener', {
    port: 80,
    open: true,
    })

    const asg = new autoscaling.AutoScalingGroup(this, 'TargetFleetAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType(ec2.InstanceSize.SMALL),
        machineImage: new ec2.AmazonLinuxImage()
    })

    listener.addTargets('TargetFleetTg', {
    port: 8080,
    targets: [asg]
    })

  }
}
