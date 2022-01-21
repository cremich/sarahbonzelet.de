import { Construct } from "constructs";
import { aws_certificatemanager as acm } from "aws-cdk-lib";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";

export interface ApiGatewayProps {
  corsSettings?: apigw.CorsPreflightOptions;
  customDomainName?: string;
}

export class ApiGateway extends Construct {
  public domainName: apigw.DomainName;
  public httpApi: apigw.HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    if (props.customDomainName) {
      const certificate = new acm.Certificate(this, "api-certificate", {
        domainName: props.customDomainName,
        validation: acm.CertificateValidation.fromDns(),
      });
      this.domainName = new apigw.DomainName(this, "custom-domain-name", {
        domainName: props.customDomainName,
        certificate,
      });
    }

    this.httpApi = new apigw.HttpApi(this, "api-gateway", {
      defaultDomainMapping: this.domainName
        ? {
            domainName: this.domainName,
          }
        : undefined,
      corsPreflight: props.corsSettings,
    });
  }
}
