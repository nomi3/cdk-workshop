import { CfnLoadBalancer, CfnListener } from '@aws-cdk/aws-elasticloadbalancingv2'
import { ConstructProps } from '../../types/index'

export default function ({ stack, scope, id, props }: ConstructProps, vpc: any, sg: any): void {
  // Alb
  const alb = new CfnLoadBalancer(stack, 'alb', {
    loadBalancerAttributes: [
      {
        key: 'idle_timeout.timeout_seconds',
        value: '60'
      }
    ],
    scheme: 'internet-facing',
    // securityGroups: ,
    subnets: [ // vpc.tsで定義したものを参照したい
      vpc.,
      '10.0.2.0/24'
    ]
  })

  // Listener
  new CfnListener(stack, 'listener', {
    defaultActions: [
      {
        type: 'forward'
        // targetGroupArn:
      }
    ],
    loadBalancerArn: alb.ref,
    port: 80,
    protocol: 'HTTP'
  })
}
