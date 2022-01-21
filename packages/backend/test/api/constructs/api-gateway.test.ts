import { assertions, Duration, Stack } from "aws-cdk-lib";
import { ApiGateway } from "../../../lib/api/constructs/api-gateway";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";

let stack: Stack;

describe("Test API Gateway construct", () => {
  beforeEach(() => {
    stack = new Stack();
  });

  it("should create a default api gateway", () => {
    new ApiGateway(stack, "apiGateway", {});

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Name: "api-gateway",
      ProtocolType: "HTTP",
    });
  });

  it("should create an api gateway with default domain name", () => {
    new ApiGateway(stack, "apiGateway", {});

    const assert = assertions.Template.fromStack(stack);
    assert.resourceCountIs("AWS::ApiGatewayV2::DomainName", 0);
  });

  it("should create an api gateway with custom domain name", () => {
    new ApiGateway(stack, "apiGateway", {
      customDomainName: "api.example.com",
    });

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::DomainName", {
      DomainName: "api.example.com",
      DomainNameConfigurations: [
        {
          CertificateArn: {
            Ref: "apiGatewayapicertificateC58F6882",
          },
          EndpointType: "REGIONAL",
        },
      ],
    });

    assert.hasResourceProperties("AWS::ApiGatewayV2::ApiMapping", {
      ApiId: {
        Ref: "apiGatewayapigateway1B5A193E",
      },
      DomainName: {
        Ref: "apiGatewaycustomdomainname35320738",
      },
      Stage: "$default",
    });
  });

  it("should set cors preflight settings", () => {
    new ApiGateway(stack, "apiGateway", {
      corsSettings: {
        allowHeaders: ["content-type"],
        allowMethods: [
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.HEAD,
          apigw.CorsHttpMethod.OPTIONS,
          apigw.CorsHttpMethod.POST,
        ],
        allowOrigins: ["www.example.com"],
        maxAge: Duration.days(10),
      },
    });

    const assert = assertions.Template.fromStack(stack);
    assert.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Name: "api-gateway",
      ProtocolType: "HTTP",
      CorsConfiguration: {
        AllowHeaders: ["content-type"],
        AllowMethods: ["GET", "HEAD", "OPTIONS", "POST"],
        AllowOrigins: ["www.example.com"],
        MaxAge: 864000,
      },
    });
  });
});
