#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebsiteStack } from "../lib/website-stack";

const app = new cdk.App();
new WebsiteStack(app, "sarah-bonzelet-de-dev", {});
new WebsiteStack(app, "sarah-bonzelet-de-prod", {
  apiDomainName: "api2.sarahbonzelet.de",
});
