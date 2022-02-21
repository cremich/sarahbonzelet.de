import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
  apiDomainName: process.env.API_DOMAIN_NAME || "",
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
            branch: process.env.AMPLIFY_GITHUB_BRANCH || "main",
            oauthSecretName: process.env.AMPLIFY_GITHUB_OAUTHSECRET_NAME || "",
          },
        }
      : undefined,
};
