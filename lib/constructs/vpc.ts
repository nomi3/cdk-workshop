import { Stack, CfnTag } from '@aws-cdk/core'
import { CfnVPC, CfnInternetGateway, CfnSubnet, CfnVPCGatewayAttachment } from '@aws-cdk/aws-ec2'

export default function (stack: Stack, commonTags: CfnTag[] = []) {
    // VPC
    const vpc = new CfnVPC(stack, 'VPC', {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      instanceTenancy: 'default',
      tags: [
        ...commonTags
      ]
    })

    // InternetGateway
    const igw = new CfnInternetGateway(stack, 'igw', {
      tags: [
        ...commonTags
      ]
    })

    new CfnVPCGatewayAttachment(stack, 'igwAttachment', {
      internetGatewayId: igw.ref,
      vpcId: vpc.ref
    })

    // Subnet
    const publicSubnet1 = new CfnSubnet(stack, 'PublicSubnet1', {
      cidrBlock: '10.0.1.0/24',
      vpcId: vpc.ref,
      // availabilityZone: 

    })
    const publicSubnet2 = new CfnSubnet(stack, 'PublicSubnet2', {
      cidrBlock: '10.0.2.0/24',
      vpcId: vpc.ref,
      // availabilityZone: 

    })

}
