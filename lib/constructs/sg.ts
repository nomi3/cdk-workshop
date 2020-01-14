import { CfnSecurityGroup, CfnSecurityGroupIngress } from '@aws-cdk/aws-ec2'
import { ConstructProps } from '../../types/index'

export default function ({ stack, scope, id, props }: ConstructProps, vpc: any): any {
  // PublicAlbSg
  const publicAlbSg = new CfnSecurityGroup(stack, 'publicAlbSg', {
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
    vpcId: vpc.vpc.ref
  })

  // TargetFleetSg
  const targetFleetSg = new CfnSecurityGroup(stack, 'targetFleetSg', {
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
    vpcId: vpc.vpc.ref
  })

  new CfnSecurityGroupIngress(stack, 'targetFleetSgIngress1', {
    sourceSecurityGroupId: publicAlbSg.ref,
    description: 'Rule For HTTP Access From Public ALB',
    ipProtocol: 'tcp',
    fromPort: 80,
    toPort: 80,
    groupId: targetFleetSg.ref
  })

  return { publicAlbSg, targetFleetSg }
}
