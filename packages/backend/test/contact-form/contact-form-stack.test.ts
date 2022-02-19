import { assertions, Stack, aws_apigateway as apigw } from "aws-cdk-lib";
import { ContactFormStack } from "../../lib/contact-form/contact-form-stack";

let stack: Stack;

describe("Contact form stack", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  test("Resources are tagged with component tag", () => {
    const contactFormStack = new ContactFormStack(stack, "website", {
      apiGateway: new apigw.RestApi(stack, "apigw"),
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

  test("/contact resource is registered on api gateway", () => {
    new ContactFormStack(stack, "website", {
      apiGateway: new apigw.RestApi(stack, "apigw"),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGateway::Resource", {
      ParentId: {
        "Fn::GetAtt": ["apigw88C2FCEE", "RootResourceId"],
      },
      PathPart: "contact",
      RestApiId: {
        Ref: "apigw88C2FCEE",
      },
    });
  });

  test("POST method /contact resource is integrated with lambda handler", () => {
    new ContactFormStack(stack, "website", {
      apiGateway: new apigw.RestApi(stack, "apigw"),
      targetEmailAddress: "me@example.com",
    });

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "POST",
      ResourceId: {
        Ref: "apigwcontact0DABBFA0",
      },
      RestApiId: {
        Ref: "apigw88C2FCEE",
      },
      AuthorizationType: "NONE",
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS_PROXY",
        Uri: {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                Ref: "AWS::Partition",
              },
              ":apigateway:",
              {
                Ref: "AWS::Region",
              },
              ":lambda:path/2015-03-31/functions/",
              {
                "Fn::GetAtt": [
                  "websiteNestedStackwebsiteNestedStackResource72BFA48B",
                  "Outputs.websitecontactformhandlerBE451811Arn",
                ],
              },
              "/invocations",
            ],
          ],
        },
      },
    });
  });
  test("Target email address is configured as environment variable of the Lambda function", () => {
    const contactFormStack = new ContactFormStack(stack, "website", {
      apiGateway: new apigw.RestApi(stack, "apigw"),
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
      apiGateway: new apigw.RestApi(stack, "apigw"),
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
