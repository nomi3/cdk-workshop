// import sns = require('@aws-cdk/aws-sns');
// import subs = require('@aws-cdk/aws-sns-subscriptions');
// import sqs = require('@aws-cdk/aws-sqs');
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
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
        },
        // {
        //   cidrMask: 24,
        //   name: 'PublicSubnet2',
        //   subnetType: SubnetType.PUBLIC,
        // },
      ]
      // vpcId: 'VPC'
    })
    // Create the load balancer in a VPC. 'internetFacing' is 'false'
    // by default, which creates an internal load balancer.
    // const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
    //     vpc,
    //     internetFacing: true
    // });
    //
    // // Add a listener and open up the load balancer's security group
    // // to the world. 'open' is the default, set this to 'false'
    // // and use `listener.connections` if you want to be selective
    // // about who can access the listener.
    // const listener = lb.addListener('Listener', {
    //     port: 80,
    //     open: true,
    // });
    //
    //
    // // Create an AutoScaling group and add it as a load balancing
    // // target to the listener.
    // const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
    //     vpc,
    //     instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.T2, ec2.InstanceSize.Small),
    //     machineImage: new ec2.AmazonLinuxImage()
    // });
    //
    // listener.addTargets('ApplicationFleet', {
    //     port: 8080,
    //     targets: [asg]
    // });

    // const subnet1 = new Subnet(this, 'PublicSubnet1', {
    //   cidrBlock: '10.0.1.0/24',
    //   vpcId: 'VPC',
    //   availabilityZone: ''
    // })
  //   const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
  //     visibilityTimeout: cdk.Duration.seconds(300)
  //   });
  //
  //   const topic = new sns.Topic(this, 'CdkWorkshopTopic');
  //
  //   topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
