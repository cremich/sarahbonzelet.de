import { assertions, Stack } from "aws-cdk-lib";
import { ApiStack } from "../../lib/api/api-stack";

let stack: Stack;

describe("Api stack", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  test("Resources are tagged with component tag", () => {
    const nestedStack = new ApiStack(stack, "api", {});

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Tags: {
        component: "api",
      },
    });
  });

  test("Allowed origins are merged with http://localhost:1313", () => {
    const nestedStack = new ApiStack(stack, "api", {
      corsAllowedOrigins: ["http://api.example.com"],
    });

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowHeaders: ["content-type"],
        AllowMethods: ["GET", "HEAD", "OPTIONS", "POST"],
        AllowOrigins: ["http://localhost:1313", "http://api.example.com"],
        MaxAge: 864000,
      },
    });
  });

  test("Allowed origin http://localhost:1313 is set by default", () => {
    const nestedStack = new ApiStack(stack, "api", {});

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowHeaders: ["content-type"],
        AllowMethods: ["GET", "HEAD", "OPTIONS", "POST"],
        AllowOrigins: ["http://localhost:1313"],
        MaxAge: 864000,
      },
    });
  });
});
