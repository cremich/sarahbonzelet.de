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
    assert.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Tags: [
        {
          Key: "component",
          Value: "api",
        },
      ],
    });
  });

  test("Certificate is create if custom domain is requested", () => {
    const nestedStack = new ApiStack(stack, "api", {
      apiDomainName: "test.example.com",
    });

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::CertificateManager::Certificate", {
      DomainName: "test.example.com",
    });
  });

  test("Allowed origins are merged with http://localhost:1313", () => {
    const nestedStack = new ApiStack(stack, "api", {
      corsAllowedOrigins: ["http://api.example.com"],
    });

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "OPTIONS",
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              "method.response.header.Access-Control-Allow-Headers": "'content-type'",
              "method.response.header.Access-Control-Allow-Origin": "'http://localhost:1313'",
              "method.response.header.Vary": "'Origin'",
              "method.response.header.Access-Control-Allow-Methods": "'GET,HEAD,OPTIONS,POST'",
              "method.response.header.Access-Control-Max-Age": "'864000'",
            },
            ResponseTemplates: {
              "application/json":
                '#set($origin = $input.params().header.get("Origin"))\n#if($origin == "") #set($origin = $input.params().header.get("origin")) #end\n#if($origin.matches("http://api.example.com"))\n  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)\n#end',
            },
            StatusCode: "204",
          },
        ],
        RequestTemplates: {
          "application/json": "{ statusCode: 200 }",
        },
        Type: "MOCK",
      },
      MethodResponses: [
        {
          ResponseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Vary": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Max-Age": true,
          },
          StatusCode: "204",
        },
      ],
    });
  });

  test("Allowed origin http://localhost:1313 is set by default", () => {
    const nestedStack = new ApiStack(stack, "api", {});

    const assert = assertions.Template.fromStack(nestedStack);
    assert.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "OPTIONS",
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              "method.response.header.Access-Control-Allow-Headers": "'content-type'",
              "method.response.header.Access-Control-Allow-Origin": "'http://localhost:1313'",
              "method.response.header.Vary": "'Origin'",
              "method.response.header.Access-Control-Allow-Methods": "'GET,HEAD,OPTIONS,POST'",
              "method.response.header.Access-Control-Max-Age": "'864000'",
            },
            StatusCode: "204",
          },
        ],
        RequestTemplates: {
          "application/json": "{ statusCode: 200 }",
        },
        Type: "MOCK",
      },
      MethodResponses: [
        {
          ResponseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Vary": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Max-Age": true,
          },
          StatusCode: "204",
        },
      ],
    });
  });
});
