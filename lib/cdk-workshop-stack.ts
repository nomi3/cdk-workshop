import { App, Stack, StackProps } from '@aws-cdk/core'
import genVpc from './constructs/vpc'
import genSg from './constructs/sg'

export class CdkWorkshopStack extends Stack {
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    genVpc({
      stack: this,
      scope,
      id,
      props
    })

    genSg({
      stack: this,
      scope,
      id,
      props
    },
    vpc
    )
  }
}
