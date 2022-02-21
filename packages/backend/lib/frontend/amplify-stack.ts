import { Construct } from "constructs";
import { NestedStack, NestedStackProps, SecretValue, Tags } from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";

export interface AmplifyStackProps extends NestedStackProps {
  buildSettings: {
    buildEnv: string;
  };
  domainSettings: {
    subdomain: string;
    domainName: string;
  };
  github: {
    branch: string;
    oauthSecretName: string;
  };
  accessControlSettings?: {
    globalBasicAuth: boolean;
  };
}

export class AmplifyStack extends NestedStack {
  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "sarahbonzelet-website", {
      appName: `${props.domainSettings.subdomain}.${props.domainSettings.domainName}`,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "cremich",
        repository: "sarahbonzelet.de",
        oauthToken: SecretValue.secretsManager(props.github.oauthSecretName),
      }),
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: "packages/website",
        BUILD_ENV: props.buildSettings.buildEnv,
      },
      basicAuth:
        props.accessControlSettings && props.accessControlSettings.globalBasicAuth === true
          ? amplify.BasicAuth.fromGeneratedPassword("guest")
          : undefined,
    });

    const branch = amplifyApp.addBranch(props.github.branch);

    if (props.domainSettings) {
      const amplifyDomain = amplifyApp.addDomain(props.domainSettings.domainName, {
        enableAutoSubdomain: true, // in case subdomains should be auto registered for branches
        autoSubdomainCreationPatterns: ["*"], // regex for branches that should auto register subdomains
      });
      amplifyDomain.mapSubDomain(branch, props.domainSettings.subdomain);
    }

    Tags.of(this).add("component", "frontend");
  }
}
