import {
  Tag
} from '@aws-cdk/core'

import {
  CfnVPC,
  CfnInternetGateway,
  CfnVPCGatewayAttachment,
  CfnSubnet,
  CfnRouteTable,
  CfnRoute,
  CfnSubnetRouteTableAssociation
} from '@aws-cdk/aws-ec2'

import {
  ConstructProps,
  NetworkConstructs
} from '../../types/index'

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  // VPC
  const vpc = new CfnVPC(stack, 'VPC', {
    cidrBlock: '10.0.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    instanceTenancy: 'default'
  })

  // InternetGateway
  const igw = new CfnInternetGateway(stack, 'igw')
  new CfnVPCGatewayAttachment(stack, 'igwAttachment', {
    internetGatewayId: igw.ref,
    vpcId: vpc.ref
  })

  // Subnet
  const publicSubnet1 = new CfnSubnet(stack, 'PublicSubnet1', {
    cidrBlock: '10.0.1.0/24',
    vpcId: vpc.ref,
    availabilityZone: stack.availabilityZones[0]
  })
  const publicSubnet2 = new CfnSubnet(stack, 'PublicSubnet2', {
    cidrBlock: '10.0.2.0/24',
    vpcId: vpc.ref,
    availabilityZone: stack.availabilityZones[1]
  })

  // RouteTable
  const publicRouteTable = new CfnRouteTable(stack, 'PublicRouteTable', {
    vpcId: vpc.ref
  })
  new CfnRoute(stack, 'PublicRoute', {
    routeTableId: publicRouteTable.ref,
    destinationCidrBlock: '0.0.0.0/0',
    gatewayId: igw.ref
  })
  new CfnSubnetRouteTableAssociation(stack, 'PublicSubnet1RouteTableAssociation', {
    routeTableId: publicRouteTable.ref,
    subnetId: publicSubnet1.ref
  })
  new CfnSubnetRouteTableAssociation(stack, 'PublicSubnet2RouteTableAssociation', {
    routeTableId: publicRouteTable.ref,
    subnetId: publicSubnet2.ref
  })

  // Tag
  ;[
    vpc,
    igw,
    publicSubnet2,
    publicSubnet1,
    publicRouteTable
  ].forEach(construct => {
    Tag.add(construct, 'Application', id)
    Tag.add(construct, 'Name', construct.node.id)
  })

  network.vpc = vpc
  network.subnets.public.push(publicSubnet1, publicSubnet2)
}
