import { Tag } from '@aws-cdk/core'
import { CfnLoadBalancer, CfnListener, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2'
import { ConstructProps, NetworkConstructs } from '../../types/index'

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  if (typeof network.loadBalancer.sg === 'undefined') {
    throw new Error('VPC not created')
  }
  if (typeof network.vpc === 'undefined') {
    throw new Error('VPC not created')
  }
  // Alb
  network.loadBalancer.elb = new CfnLoadBalancer(stack, 'alb', {
    loadBalancerAttributes: [
      {
        key: 'idle_timeout.timeout_seconds',
        value: '60'
      }
    ],
    scheme: 'internet-facing',
    securityGroups: [network.loadBalancer.sg.ref],
    subnets: [
      network.subnets.public[0].ref,
      network.subnets.public[1].ref
    ]
  })

  // Target Group
  network.fleet.tg = new CfnTargetGroup(stack, 'targetFleetTg', {
    vpcId: network.vpc.ref,
    port: 80,
    protocol: 'HTTP',
    healthCheckIntervalSeconds: 30,
    healthCheckPath: '/index.html',
    healthCheckProtocol: 'HTTP',
    healthCheckTimeoutSeconds: 5,
    healthyThresholdCount: 2,
    targetType: 'instance',
    targetGroupAttributes: [
      {
        key: 'deregistration_delay.timeout_seconds',
        value: '30'
      },
      {
        key: 'stickiness.enabled',
        value: 'false'
      }
    ],
    matcher: {
      httpCode: '200-299'
    }
  })
  network.fleet.tg.addDependsOn(network.loadBalancer.elb)

  // Listener
  new CfnListener(stack, 'listener', {
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: network.fleet.tg.ref
      }
    ],
    loadBalancerArn: network.loadBalancer.elb.ref,
    port: 80,
    protocol: 'HTTP'
  })

  // Tag
  ;[
    network.loadBalancer.elb,
    network.fleet.tg
  ].forEach(construct => {
    Tag.add(construct, 'Application', id)
  })
}
