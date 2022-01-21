import { Construct } from "constructs";
import { CfnOutput, Duration, NestedStack, NestedStackProps, Tags } from "aws-cdk-lib";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";

import { ApiGateway } from "./constructs/api-gateway";

export interface ApiProps extends NestedStackProps {
  readonly apiDomainName?: string;
  readonly corsAllowedOrigins?: string[];
}

export class ApiStack extends NestedStack {
  public apiGateway: apigw.HttpApi;
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const localhostOrigins = ["http://localhost:1313"];
    //see https://stackoverflow.com/a/51992342/11239808
    const allowOrigins = [...localhostOrigins, ...(props.corsAllowedOrigins || [])];

    const apiGateway = new ApiGateway(this, "api-gateway", {
      corsSettings: {
        allowHeaders: ["content-type"],
        allowMethods: [
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.HEAD,
          apigw.CorsHttpMethod.OPTIONS,
          apigw.CorsHttpMethod.POST,
        ],
        allowOrigins: allowOrigins,
        maxAge: Duration.days(10),
      },
      customDomainName: props.apiDomainName,
    });
    this.apiGateway = apiGateway.httpApi;

    Tags.of(this).add("component", "api");
  }
}
