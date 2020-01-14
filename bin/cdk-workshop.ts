#!/usr/bin/env node
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack'
import * as cdk from '@aws-cdk/core'
const app = new cdk.App()
;(() => new CdkWorkshopStack(app, 'CdkWorkshopStack'))()
