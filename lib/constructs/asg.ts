import { CfnAutoScalingGroup, CfnLaunchConfiguration } from '@aws-cdk/aws-autoscaling'
import { ConstructProps, NetworkConstructs } from '../../types/index'
import { CfnMapping, CfnOutput } from '@aws-cdk/core'

const targetCapacity = {
  minSize: '1',
  default: '2'
}

export default function (
  { stack, scope, id, props }: ConstructProps,
  network: NetworkConstructs
): void {
  if (typeof network.fleet.sg === 'undefined') {
    throw new Error('Security Group of fleet not created')
  }
  if (typeof network.fleet.tg === 'undefined') {
    throw new Error('Target Group of fleet not created')
  }
  if (typeof network.vpc === 'undefined') {
    throw new Error('VPC not created')
  }
  if (typeof network.instanceProfile === 'undefined') {
    throw new Error('Instance Profile not created')
  }
  if (typeof network.loadBalancer.elb === 'undefined') {
    throw new Error('Alb not created')
  }
  const amazonLinuxAmi = new CfnMapping(stack, 'amazonLinuxAmi', {
    mapping: {
      'ap-northeast-1': { ami: 'ami-0a2de1c3b415889d2' },
      'ap-northeast-2': { ami: 'ami-0b4fdb56a00adb616' },
      'ap-south-1': { ami: 'ami-06bcd1131b2f55803' },
      'ap-southeast-1': { ami: 'ami-0b84d2c53ad5250c2' },
      'ap-southeast-2': { ami: 'ami-08589eca6dcc9b39c' },
      'ca-central-1': { ami: 'ami-076b4adb3f90cd384' },
      'eu-central-1': { ami: 'ami-034fffcc6a0063961' },
      'eu-west-1': { ami: 'ami-09693313102a30b2c' },
      'eu-west-2': { ami: 'ami-0274e11dced17bb5b' },
      'eu-west-3': { ami: 'ami-051707cdba246187b' },
      'sa-east-1': { ami: 'ami-0112d42866980b373' },
      'us-east-1': { ami: 'ami-009d6802948d06e52' },
      'us-east-2': { ami: 'ami-02e680c4540db351e' },
      'us-west-1': { ami: 'ami-011b6930a81cd6aaf' },
      'us-west-2': { ami: 'ami-01bbe152bf19d0289' }
    }
  })
  const targetFleetLaunchConfig = new CfnLaunchConfiguration(stack, 'targetFleetLaunchConfig', {
    imageId: amazonLinuxAmi.findInMap(stack.region, 'ami'),
    instanceType: 't3.micro',
    securityGroups: [network.fleet.sg.ref],
    instanceMonitoring: false,
    associatePublicIpAddress: true,
    iamInstanceProfile: network.instanceProfile.ref
  })

  targetFleetLaunchConfig.addOverride('Metadata', {
    'AWS::CloudFormation::Init': {
      configSets: {
        create_and_update: [
          'config-cfn_hup',
          'config-setup_httpd'
        ]
      },
      'config-cfn_hup': {
        files: {
          '/etc/cfn/cfn-hup.conf': {
            mode: '000400',
            content: 'a'
          },
          '/etc/cfn/hooks.d/cfn-auto-reloader.conf': {
            content: 'a'
          }
        },
        services: {
          sysvinit: {
            'cfn-hup': {
              enabled: true,
              ensureRunning: true,
              files: [
                '/etc/cfn/cfn-hup.conf',
                '/etc/cfn/hooks.d/cfn-auto-reloader.conf'
              ]
            }
          }
        }
      },
      'config-setup_httpd': {
        packages: {
          yum: {
            httpd: [],
            php: []
          }
        },
        files: {
          '/var/www/html/index.html': {
            content: 'a',
            mode: '000644',
            owner: 'apache',
            group: 'apache'
          },
          '/var/www/html/info.php': {
            content: '<?php phpinfo();',
            mode: '000644',
            owner: 'apache',
            group: 'apache'
          },
          '/var/www/html/wait.php': {
            content: 'a',
            mode: '000644',
            owner: 'apache',
            group: 'apache'
          }
        },
        services: {
          sysvinit: {
            httpd: {
              enabled: true,
              ensureRunning: true
            }
          }
        }
      }
    }
  })

  const targetFleetAutoScalingGroup = new CfnAutoScalingGroup(stack, 'targetFleetAutoScalingGroup', {
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
    ],
    tags: [
      {
        key: 'Application',
        value: id,
        propagateAtLaunch: true
      }
    ]
  })
  targetFleetAutoScalingGroup.addOverride('CreationPolicy.ResourceSignal.Timeout', 'PT15M')
  targetFleetAutoScalingGroup.addOverride('UpdatePolicy.AutoScalingReplacingUpdate.WillReplace', true)

  new CfnOutput(stack, 'endpoint', {
    value: 'http://' + network.loadBalancer.elb.attrDnsName,
    description: 'URL of the target website'
  })
}
