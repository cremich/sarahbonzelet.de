import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
  apiDomainName: "api-dev.sarahbonzelet.de",
  amplify:
    process.env.AMPLIFY_ENABLE === "true"
      ? {
          buildSettings: {
            buildEnv: "dev",
          },
          domainSettings: {
            domainName: "sarahbonzelet.de",
            subdomain: "dev",
          },
          accessControlSettings: {
            globalBasicAuth: true,
          },
          github: {
            branch: "main",
            oauthSecretName: "github-token",
          },
        }
      : undefined,
};
