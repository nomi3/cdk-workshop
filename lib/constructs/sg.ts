import { Tag } from '@aws-cdk/core'
import { CfnSecurityGroup, CfnSecurityGroupIngress } from '@aws-cdk/aws-ec2'
import { ConstructProps, NetworkConstructs } from '../../types/index'

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  if (typeof network.vpc === 'undefined') {
    throw new Error('VPC not created')
  }

  // PublicAlbSg
  network.loadBalancer.sg = new CfnSecurityGroup(stack, 'publicAlbSg', {
    groupDescription: 'SecurityGroup for Public ALB',
    securityGroupIngress: [
      {
        ipProtocol: 'tcp',
        cidrIp: '0.0.0.0/0',
        description: 'Enable HTTP access via port 80',
        fromPort: 80,
        toPort: 80
      }
    ],
    vpcId: network.vpc.ref
  })

  // TargetFleetSg
  network.fleet.sg = new CfnSecurityGroup(stack, 'targetFleetSg', {
    groupDescription: 'SecurityGroup for Target Fleet',
    securityGroupIngress: [
      {
        ipProtocol: 'tcp',
        cidrIp: '0.0.0.0/0',
        description: 'Enable SSH access via port 22',
        fromPort: 22,
        toPort: 22
      }
    ],
    vpcId: network.vpc.ref
  })

  new CfnSecurityGroupIngress(stack, 'targetFleetSgIngress1', {
    sourceSecurityGroupId: network.loadBalancer.sg.ref,
    description: 'Rule For HTTP Access From Public ALB',
    ipProtocol: 'tcp',
    fromPort: 80,
    toPort: 80,
    groupId: network.fleet.sg.ref
  })

  // Tag
  ;[
    network.loadBalancer.sg,
    network.fleet.sg
  ].forEach(construct => {
    Tag.add(construct, 'Application', id)
    Tag.add(construct, 'Name', construct.node.id)
  })
}
