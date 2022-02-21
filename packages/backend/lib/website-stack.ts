import { CfnOutput, NestedStack, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiStack } from "./api/api-stack";
import { ContactFormStack } from "./contact-form/contact-form-stack";
import { AmplifyStack } from "./frontend/amplify-stack";

interface WebsiteStackProps extends StackProps {
  readonly apiDomainName?: string;
  readonly contactFormRecipientEmailAddress?: string;
  readonly amplify?: {
    buildSettings: {
      buildEnv: string;
    };
    domainSettings: {
      subdomain: string;
      domainName: string;
    };
    accessControlSettings?: {
      globalBasicAuth: boolean;
    };
    github: {
      branch: string;
      oauthSecretName: string;
    };
  };
}

export class WebsiteStack extends Stack {
  public contactFormStack: NestedStack;

  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const apiStack = new ApiStack(this, "api", {
      apiDomainName: props.apiDomainName,
      corsAllowedOrigins: ["dev.sarahbonzelet.de"],
    });

    if (props.contactFormRecipientEmailAddress) {
      this.contactFormStack = new ContactFormStack(this, "contact-form", {
        apiGateway: apiStack.apiGateway,
        targetEmailAddress: props.contactFormRecipientEmailAddress,
      });
    }

    if (props.amplify) {
      new AmplifyStack(this, "frontend", {
        buildSettings: props.amplify.buildSettings,
        domainSettings: props.amplify.domainSettings,
        github: props.amplify.github,
        accessControlSettings: props.amplify.accessControlSettings,
      });
    }

    new CfnOutput(this, "default-api-endpoint", {
      value: apiStack.apiGateway.url,
      description: "API Gateway default endpoint",
    });

    Tags.of(this).add("application", "sarahbonzelet.de");
  }
}
