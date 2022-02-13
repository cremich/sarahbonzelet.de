import { CfnOutput, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiStack } from "./api/api-stack";
import { ContactFormStack } from "./contact-form/contact-form-stack";

interface WebsiteStackProps extends StackProps {
  readonly apiDomainName?: string;
  readonly contactFormRecipientEmailAddress?: string;
}

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const apiStack = new ApiStack(this, "api", {
      apiDomainName: props.apiDomainName,
    });

    if (props.contactFormRecipientEmailAddress) {
      new ContactFormStack(this, "contact-form", {
        apiGateway: apiStack.apiGateway,
        targetEmailAddress: props.contactFormRecipientEmailAddress,
      });
    }

    new CfnOutput(this, "default-api-endpoint", {
      value: apiStack.apiGateway.apiEndpoint,
      description: "API Gateway default endpoint",
    });

    Tags.of(this).add("application", "sarahbonzelet.de");
  }
}
