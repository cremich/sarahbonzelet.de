import { assertions, Stack } from "aws-cdk-lib";
import { HostingStack } from "../../lib/frontend/hosting-stack";

let stack: Stack;

describe("Hosting stack", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  test("Amplify application is created", () => {
    const hostingStack = new HostingStack(stack, "hosting", {
      domainSettings: {
        subdomain: "test",
        domainName: "example.com",
      },
    });

    const assert = assertions.Template.fromStack(hostingStack);
    assert.hasResourceProperties("AWS::Amplify::App", {
      Tags: [
        {
          Key: "component",
          Value: "frontend",
        },
      ],
    });
  });

  test("Global basic auth is configured", () => {
    const hostingStack = new HostingStack(stack, "hosting", {
      domainSettings: {
        subdomain: "test",
        domainName: "example.com",
      },
      accessControlSettings: {
        globalBasicAuth: true,
      },
    });

    const assert = assertions.Template.fromStack(hostingStack);
    assert.hasResourceProperties("AWS::Amplify::App", {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Username: "guest",
      },
    });
  });
});
