import { CfnRole, CfnInstanceProfile } from '@aws-cdk/aws-iam'
import { ConstructProps, NetworkConstructs } from '../../types/index'

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  const role = new CfnRole(stack, 'role', {
    assumeRolePolicyDocument: {
      version: '2012-10-17',
      statement: [{
        action: 'sts:AssumeRole',
        effect: 'Allow',
        principal: {
          service: 'ec2.amazonaws.com'
        }
      }]
    },
    path: '/'
  })

  const instanceProfile = new CfnInstanceProfile(stack, 'instanceProfile', {
    roles: [role.ref],
    path: '/'
  })
  network.instanceProfile = instanceProfile
}
