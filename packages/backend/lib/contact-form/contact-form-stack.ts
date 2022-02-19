import { Construct } from "constructs";
import * as path from "path";
import {
  Stack,
  custom_resources as cr,
  aws_iam as iam,
  aws_lambda_nodejs as lambdaNodejs,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_apigateway as apigw,
  Duration,
  NestedStack,
  NestedStackProps,
  Tags,
} from "aws-cdk-lib";

export interface ContactFormProps extends NestedStackProps {
  apiGateway: apigw.IRestApi;
  targetEmailAddress: string;
}

export class ContactFormStack extends NestedStack {
  public domainName: apigw.DomainName;

  constructor(scope: Construct, id: string, props: ContactFormProps) {
    super(scope, id);

    new cr.AwsCustomResource(this, `email-identity-${props.targetEmailAddress}`, {
      onCreate: {
        service: "SES",
        action: "verifyEmailIdentity",
        parameters: {
          EmailAddress: props.targetEmailAddress,
        },
        physicalResourceId: cr.PhysicalResourceId.of("verify-" + props.targetEmailAddress),
      },
      onDelete: {
        service: "SES",
        action: "deleteIdentity",
        parameters: {
          Identity: props.targetEmailAddress,
        },
      },
      policy: this.generateSesPolicyForCustomResource("VerifyEmailIdentity", "DeleteIdentity"),
    });

    const contactFormHandlerFunction = new lambdaNodejs.NodejsFunction(this, "contact-form-handler", {
      entry: path.join(__dirname, "./lambdas", "send-email.ts"),
      handler: "handler",
      bundling: { externalModules: [], sourceMap: true, minify: true },
      runtime: lambda.Runtime.NODEJS_14_X,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_DAY,
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
      architecture: lambda.Architecture.ARM_64,
      timeout: Duration.seconds(60),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["ses:SendEmail"],
          resources: [this.constructSesEmailIdentityArn(props.targetEmailAddress)],
        }),
      ],
      environment: {
        SES_TARGET_EMAIL: props.targetEmailAddress,
      },
    });

    const contactFormDefaultIntegration = new apigw.LambdaIntegration(contactFormHandlerFunction);

    const contactResource = props.apiGateway.root.addResource("contact");
    contactResource.addMethod("POST", contactFormDefaultIntegration);

    Tags.of(this).add("component", "contact-form");
  }

  private generateSesPolicyForCustomResource(...methods: string[]): cr.AwsCustomResourcePolicy {
    // for some reason the default policy is generated as `email:<method>` which does not work -> hence we need to provide our own
    return cr.AwsCustomResourcePolicy.fromStatements([
      new iam.PolicyStatement({
        actions: methods.map((method) => "ses:" + method),
        effect: iam.Effect.ALLOW,
        // PolicySim says ses:SetActiveReceiptRuleSet does not allow specifying a resource, hence use '*'
        resources: ["*"],
      }),
    ]);
  }
  private constructSesEmailIdentityArn(targetEmailAddress: string): string {
    return `arn:aws:ses:${Stack.of(this).region}:${Stack.of(this).account}:identity/${targetEmailAddress}`;
  }
}
