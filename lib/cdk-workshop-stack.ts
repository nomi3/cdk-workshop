import { App, Stack, StackProps } from '@aws-cdk/core'

import '..index/types/index'
import genVpc from './constructs/vpc'

export class CdkWorkshopStack extends Stack {
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    genVpc({
      stack: this,
      scope,
      id,
      props
    })
  }
}
