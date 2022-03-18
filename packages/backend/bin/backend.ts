#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebsiteStack } from "../lib/website-stack";
import { config as uatProperties } from "../env/uat";
import { config as prodProperties } from "../env/prod";
import { GithubStack } from "../lib/aws-account/github-stack";

const app = new cdk.App();

new WebsiteStack(app, "sarah-bonzelet-de-uat", {
  ...uatProperties,
});
new WebsiteStack(app, "sarah-bonzelet-de-prod", {
  ...prodProperties,
});

new GithubStack(app, "github", {});
