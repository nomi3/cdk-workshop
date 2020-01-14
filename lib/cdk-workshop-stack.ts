import { App, Stack, StackProps } from '@aws-cdk/core'
import genVpc from './constructs/vpc'
import genSg from './constructs/sg'
import genElb from './constructs/elb'
import genAsg from './constructs/asg'

export class CdkWorkshopStack extends Stack {
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = genVpc({
      stack: this,
      scope,
      id,
      props
    })

    const sg = genSg({
      stack: this,
      scope,
      id,
      props
    },
    vpc
    )

    const elb = genElb({
      stack: this,
      scope,
      id,
      props
    },
    vpc,
    sg
    )

    genAsg({
      stack: this,
      scope,
      id,
      props
    },
    vpc,
    elb,
    sg
    )
  }
}
