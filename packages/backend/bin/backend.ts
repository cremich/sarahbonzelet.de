#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebsiteStack } from "../lib/website-stack";
import { config as devProperties } from "../env/dev";
import { config as prodProperties } from "../env/prod";

const app = new cdk.App();

new WebsiteStack(app, "sarah-bonzelet-de-dev", {
  ...devProperties,
});
new WebsiteStack(app, "sarah-bonzelet-de-prod", {
  ...prodProperties,
});
