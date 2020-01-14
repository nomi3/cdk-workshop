import { App, Stack, StackProps } from '@aws-cdk/core'
export declare interface ConstructProps {
  stack: Stack
  scope: App
  id: string
  props?: StackProps
}
