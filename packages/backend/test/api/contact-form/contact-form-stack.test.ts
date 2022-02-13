import { assertions, Stack } from "aws-cdk-lib";
import { ContactFormStack } from "../../../lib/contact-form/contact-form-stack";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";

let stack: Stack;

describe("Contact form stack", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  test("Resources are tagged with component tag", () => {
    const contactFormStack = new ContactFormStack(stack, "website", {
      apiGateway: new apigw.HttpApi(stack, "apigw", {}),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(contactFormStack);
    assert.hasResourceProperties("AWS::Lambda::Function", {
      Tags: [
        {
          Key: "component",
          Value: "contact-form",
        },
      ],
    });
  });

  test("Lambda function is registered at /contact on api gateway", () => {
    new ContactFormStack(stack, "website", {
      apiGateway: new apigw.HttpApi(stack, "apigw", {}),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Route", {
      ApiId: {
        Ref: "apigw88C2FCEE",
      },
      RouteKey: "POST /contact",
      AuthorizationType: "NONE",
      Target: {
        "Fn::Join": [
          "",
          [
            "integrations/",
            {
              Ref: "apigwPOSTcontactcontactformintegration38C91EBE",
            },
          ],
        ],
      },
    });
  });

  test("Target email address is configured as environment variable of the Lambda function", () => {
    const contactFormStack = new ContactFormStack(stack, "website", {
      apiGateway: new apigw.HttpApi(stack, "apigw", {}),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(contactFormStack);
    assert.hasResourceProperties("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          SES_TARGET_EMAIL: "me@example.com",
        },
      },
    });
  });

  test("Target email address is verified", () => {
    const contactFormStack = new ContactFormStack(stack, "website", {
      apiGateway: new apigw.HttpApi(stack, "apigw", {}),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(contactFormStack);
    assert.hasResourceProperties("Custom::AWS", {
      Create:
        '{"service":"SES","action":"verifyEmailIdentity","parameters":{"EmailAddress":"me@example.com"},"physicalResourceId":{"id":"verify-me@example.com"}}',
      Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"me@example.com"}}',
    });
  });
});
