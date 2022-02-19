import { App, assertions } from "aws-cdk-lib";
import { WebsiteStack } from "../lib/website-stack";

let app: App;

describe("Website stack", () => {
  beforeEach(() => {
    app = new App();
  });

  test("Resources are tagged with component tag", () => {
    const stack = new WebsiteStack(app, "website", {});

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::CloudFormation::Stack", {
      Tags: [
        {
          Key: "application",
          Value: "sarahbonzelet.de",
        },
      ],
    });
  });

  test("Nested stack for contact form is created if target email address provided", () => {
    const stack = new WebsiteStack(app, "website", {
      contactFormRecipientEmailAddress: "me@example.com",
    });
    expect(stack.contactFormStack).not.toBeNull;
  });
});
