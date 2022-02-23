import { assertions, Stack } from "aws-cdk-lib";
import { AmplifyStack } from "../../lib/frontend/amplify-stack";

let stack: Stack;

describe("Website stack", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  test("Amplify application is created", () => {
    const amplifyStack = new AmplifyStack(stack, "website", {
      buildSettings: {
        buildEnv: "test",
      },
      domainSettings: {
        subdomain: "test",
        domainName: "example.com",
      },
      github: {
        branch: "main",
        oauthSecretName: "github-secret",
      },
    });

    const assert = assertions.Template.fromStack(amplifyStack);
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
    const amplifyStack = new AmplifyStack(stack, "website", {
      buildSettings: {
        buildEnv: "test",
      },
      domainSettings: {
        subdomain: "test",
        domainName: "example.com",
      },
      github: {
        branch: "main",
        oauthSecretName: "github-secret",
      },
      accessControlSettings: {
        globalBasicAuth: true,
      },
    });

    const assert = assertions.Template.fromStack(amplifyStack);
    assert.hasResourceProperties("AWS::Amplify::App", {
      BasicAuthConfig: {
        EnableBasicAuth: true,
        Username: "guest",
      },
    });
  });
});
