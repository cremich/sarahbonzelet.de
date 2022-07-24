import { Construct } from "constructs";
import {
  Duration,
  NestedStack,
  NestedStackProps,
  Tags,
  aws_apigateway as apigw,
  aws_certificatemanager as acm,
} from "aws-cdk-lib";

export interface ApiProps extends NestedStackProps {
  readonly apiDomainName?: string;
  readonly corsAllowedOrigins?: string[];
}

export class ApiStack extends NestedStack {
  public apiGateway: apigw.RestApi;
  private certificate: acm.Certificate;
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    if (props.apiDomainName) {
      this.certificate = new acm.Certificate(this, "api-certificate", {
        domainName: props.apiDomainName,
        validation: acm.CertificateValidation.fromDns(),
      });
    }

    const localhostOrigins = ["http://localhost:1313"];
    //see https://stackoverflow.com/a/51992342/11239808
    const allowOrigins = [...localhostOrigins, ...(props.corsAllowedOrigins || [])];
    const api = new apigw.RestApi(this, "api-gateway", {
      restApiName: props.apiDomainName ? props.apiDomainName : "api.sarahbonzelet.de",
      description: "API for sarahbonzelet.de",
      defaultCorsPreflightOptions: {
        allowHeaders: ["content-type"],
        allowMethods: ["GET", "HEAD", "OPTIONS", "POST"],
        allowOrigins: allowOrigins,
        maxAge: Duration.days(10),
      },
      domainName: props.apiDomainName ? { domainName: props.apiDomainName, certificate: this.certificate } : undefined,
      deployOptions: {
        metricsEnabled: true,
        tracingEnabled: true,
      },
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL],
      },
    });

    this.apiGateway = api;

    Tags.of(this).add("component", "api");
  }
}
