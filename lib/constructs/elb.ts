import { CfnLoadBalancer, CfnListener, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2'
import { ConstructProps } from '../../types/index'

export default function ({ stack, scope, id, props }: ConstructProps, vpc: any, sg: any): any {
  // Alb
  const alb = new CfnLoadBalancer(stack, 'alb', {
    loadBalancerAttributes: [
      {
        key: 'idle_timeout.timeout_seconds',
        value: '60'
      }
    ],
    scheme: 'internet-facing',
    securityGroups: sg.publicAlbSg.ref,
    subnets: [
      vpc.publicSubnet1.ref,
      vpc.publicSubnet2.ref
    ]
  })

  // Target Group
  const targetFleetTg = new CfnTargetGroup(stack, 'targetFleetTg', {
    vpcId: vpc.vpc.ref,
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

  // Listener
  new CfnListener(stack, 'listener', {
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: targetFleetTg.ref
      }
    ],
    loadBalancerArn: alb.ref,
    port: 80,
    protocol: 'HTTP'
  })
  return { targetFleetTg }
}
