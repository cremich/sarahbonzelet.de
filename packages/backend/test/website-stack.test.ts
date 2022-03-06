import { App, assertions } from "aws-cdk-lib";
import { WebsiteStack } from "../lib/website-stack";

let app: App;

describe("Website stack", () => {
  beforeEach(() => {
    app = new App();
  });

  test("Nested stack for contact form is created if target email address provided", () => {
    const stack = new WebsiteStack(app, "website", {
      contactFormRecipientEmailAddress: "me@example.com",
    });
    expect(stack.contactFormStack).not.toBeNull;
  });

  test("Nested stack for hosting is created if requested", () => {
    const stack = new WebsiteStack(app, "website", {
      hosting: {
        domainSettings: {
          domainName: "example.com",
          subdomain: "www",
        },
      },
    });
    expect(stack.hostingStack).not.toBeNull;
  });
});
