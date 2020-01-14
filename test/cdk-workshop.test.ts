import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { App } from '@aws-cdk/core'
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack'

test('EC2 VPC Created', () => {
  const app = new App()
  // WHEN
  const stack = new CdkWorkshopStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::EC2::VPC', {
    CidrBlock: '10.0.0.0/16'
  }))
})

test('EC2 Subnet Created', () => {
  const app = new App()
  // WHEN
  const stack = new CdkWorkshopStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.0.1.0/24'
  }))
  expectCDK(stack).to(haveResource('AWS::EC2::Subnet', {
    CidrBlock: '10.0.2.0/24'
  }))
})
