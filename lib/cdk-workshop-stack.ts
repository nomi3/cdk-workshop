import { App, Stack, StackProps, Tag } from '@aws-cdk/core'
import { AmazonLinuxImage, InstanceSize, InstanceType, PublicSubnet, SubnetType, Vpc, Subnet } from '@aws-cdk/aws-ec2'
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2'
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling'

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, 'VPC', {
      subnetConfiguration: [
        // 空にしておくとサブネットが自動生成されない
      ]
    })
    /*
     * @see
     * https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ec2/lib/vpc.ts#L1158
     */
    // for (const AZ of vpc.availabilityZones) {
    //   var AZnum = vpc.availabilityZones.indexOf(AZ) + 1
    //   var SubnetName = 'PublicSubnet' + AZnum
    //   var cidrBlock = '10.0.' + AZnum + '.0/24'
    //   var publicSubnet = new PublicSubnet(this, SubnetName, {
    //     availabilityZone: AZ,
    //     cidrBlock: cidrBlock,
    //     vpcId: vpc.vpcId
    //   })
    //   vpc.publicSubnets.push(publicSubnet)
    // }

    //サブネットを自分で作るとInternetGatewayとRouteが生成されない
    const publicSubnet1 = new PublicSubnet(this, 'PublicSubnet1', {
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: '10.0.1.0/24',
      vpcId: vpc.vpcId
    })
    publicSubnet1.addDefaultInternetRoute('InternetGW', vpc)
    vpc.publicSubnets.push(publicSubnet1)

    // const publicSubnet2 = new PublicSubnet(this, 'PublicSubnet2', {
    //   availabilityZone: vpc.availabilityZones[1],
    //   cidrBlock: '10.0.2.0/24',
    //   vpcId: vpc.vpcId
    // })
    // publicSubnet2.routeTable = publicSubnet1.routeTable
    // vpc.publicSubnets.push(publicSubnet2)


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

    ;[
      vpc,
      // lb,
      // listener,
      // asg,
      publicSubnet1
    ].forEach(construct => Tag.add(construct, 'Application', id))
  }
}

