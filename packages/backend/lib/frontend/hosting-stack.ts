import { Construct } from "constructs";
import { NestedStack, NestedStackProps, Tags, aws_s3_assets as assets } from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as path from "path";

export interface HostingStackProps extends NestedStackProps {
  domainSettings: {
    subdomain: string;
    domainName: string;
  };
  accessControlSettings?: {
    globalBasicAuth: boolean;
  };
}

export class HostingStack extends NestedStack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "sarahbonzelet-website", {
      appName: `${props.domainSettings.subdomain}.${props.domainSettings.domainName}`,
      basicAuth:
        props.accessControlSettings && props.accessControlSettings.globalBasicAuth === true
          ? amplify.BasicAuth.fromGeneratedPassword("guest")
          : undefined,
    });

    const branch = amplifyApp.addBranch("main", {
      asset: new assets.Asset(this, "website-asset", {
        path: path.join(__dirname, "../../../website/public"),
      }),
    });

    if (props.domainSettings) {
      const amplifyDomain = amplifyApp.addDomain(props.domainSettings.domainName);
      amplifyDomain.mapSubDomain(branch, props.domainSettings.subdomain);
    }

    Tags.of(this).add("component", "frontend");
  }
}
