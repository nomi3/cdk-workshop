import { App, Stack, StackProps } from '@aws-cdk/core'
import genVpc from './constructs/vpc'
import genSg from './constructs/sg'
import genElb from './constructs/elb'
import genAsg from './constructs/asg'
import { ConstructProps, NetworkConstructs } from '../types'

export class CdkWorkshopStack extends Stack {
  constructor (scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const opt: ConstructProps = {
      stack: this,
      scope,
      id,
      props
    }
    const network: NetworkConstructs = {
      subnets: {
        public: []
      },
      loadBalancer: {},
      fleet: {}
    }

    genVpc(opt, network)

    genSg(opt, network)

    genElb(opt, network)

    genAsg(opt, network)
  }
}
