import { CfnAutoScalingGroup, CfnLaunchConfiguration } from '@aws-cdk/aws-autoscaling'
import { ConstructProps } from '../../types/index'

const targetCapacity = {
  minSize: '1',
  default: '2'
}

export default function ({ stack, scope, id, props }: ConstructProps, vpc: any, elb: any, sg: any): any {
  const targetFleetLaunchConfig = new CfnLaunchConfiguration(stack, 'targetFleetLaunchConfig', {
    imageId: 'ami-01bbe152bf19d0289',
    instanceType: 't3.micro',
    securityGroups: sg.targetFleetSg.ref,
    instanceMonitoring: false,
    associatePublicIpAddress: true
  })
  new CfnAutoScalingGroup(stack, 'targetFleetAutoScalingGroup', {
    minSize: targetCapacity.minSize,
    maxSize: targetCapacity.default,
    vpcZoneIdentifier: [
      vpc.publicSubnet1.ref,
      vpc.publicSubnet2.ref
    ],
    availabilityZones: [
      stack.availabilityZones[0],
      stack.availabilityZones[1]
    ],
    launchConfigurationName: targetFleetLaunchConfig.ref,
    desiredCapacity: targetCapacity.default,
    healthCheckType: 'EC2',
    healthCheckGracePeriod: 60,
    targetGroupArns: [
      elb.targetFleetTg.ref
    ]
  })
}
