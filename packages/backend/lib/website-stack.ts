import { CfnOutput, NestedStack, Stack, StackProps, Tags, aws_certificatemanager as acm } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiStack } from "./api/api-stack";
import { ContactFormStack } from "./contact-form/contact-form-stack";
import { HostingStack } from "./frontend/hosting-stack";

interface WebsiteStackProps extends StackProps {
  readonly apiDomainName?: string;
  readonly contactFormRecipientEmailAddress?: string;
  readonly hosting?: {
    domainSettings: {
      domainName: string;
      subdomain: string;
    };
    accessControlSettings?: {
      globalBasicAuth: boolean;
    };
  };
}

export class WebsiteStack extends Stack {
  public contactFormStack: NestedStack;
  public hostingStack: NestedStack;

  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const apiStack = new ApiStack(this, "api", {
      apiDomainName: props.apiDomainName,
      corsAllowedOrigins: ["uat.sarahbonzelet.de", "www.sarahbonzelet.de"],
    });

    if (props.contactFormRecipientEmailAddress) {
      this.contactFormStack = new ContactFormStack(this, "contact-form", {
        apiGateway: apiStack.apiGateway,
        targetEmailAddress: props.contactFormRecipientEmailAddress,
      });
    }

    if (props.hosting) {
      this.hostingStack = new HostingStack(this, "hosting", {
        domainSettings: props.hosting.domainSettings,
        accessControlSettings: props.hosting.accessControlSettings,
      });
    }

    new CfnOutput(this, "default-api-endpoint", {
      value: apiStack.apiGateway.url,
      description: "API Gateway default endpoint",
    });

    Tags.of(this).add("application", "sarahbonzelet.de");
  }
}
