import { Stack, StackProps, Tags, aws_iam as iam, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { GithubActionsIdentityProvider, GithubActionsRole } from "aws-cdk-github-oidc";

export class GithubStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const provider = new GithubActionsIdentityProvider(this, "github-oidc-provider");
    const deployRole = new GithubActionsRole(this, "github-deployment-role", {
      provider: provider, // reference into the OIDC provider
      owner: "cremich", // your repository owner (organization or user) name
      repo: "sarahbonzelet.de", // your repository name (without the owner name)
      // filter: "ref:refs/heads/main", // JWT sub suffix filter, defaults to '*'
    });

    deployRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

    new CfnOutput(this, "deployment-role", {
      value: deployRole.roleArn,
      description: "Github deployment IAM role arn",
    });

    Tags.of(this).add("application", "sarahbonzelet.de");
  }
}
