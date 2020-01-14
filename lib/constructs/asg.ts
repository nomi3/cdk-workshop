import { CfnAutoScalingGroup, CfnLaunchConfiguration } from '@aws-cdk/aws-autoscaling'
import { ConstructProps, NetworkConstructs } from '../../types/index'

const targetCapacity = {
  minSize: '1',
  default: '2'
}

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  if (typeof network.fleet.sg === 'undefined') {
    throw new Error('VPC not created')
  }
  if (typeof network.fleet.tg === 'undefined') {
    throw new Error('VPC not created')
  }
  if (typeof network.vpc === 'undefined') {
    throw new Error('VPC not created')
  }
  const targetFleetLaunchConfig = new CfnLaunchConfiguration(stack, 'targetFleetLaunchConfig', {
    imageId: 'ami-01bbe152bf19d0289',
    instanceType: 't3.micro',
    securityGroups: [network.fleet.sg.ref],
    instanceMonitoring: false,
    associatePublicIpAddress: true
  })
  new CfnAutoScalingGroup(stack, 'targetFleetAutoScalingGroup', {
    minSize: targetCapacity.minSize,
    maxSize: targetCapacity.default,
    vpcZoneIdentifier: [
      network.subnets.public[0].ref,
      network.subnets.public[1].ref
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
      network.fleet.tg.ref
    ]
  })
}
