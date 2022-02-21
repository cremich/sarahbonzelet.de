import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress:
    process.env.CONTACT_FORM_RECIPIENT_EMAIL ??
    (() => {
      throw new Error("Environment var 'CONTACT_FORM_RECIPIENT_EMAIL' not found.");
    })(),
  apiDomainName:
    process.env.API_DOMAIN_NAME ??
    (() => {
      throw new Error("Environment var 'API_DOMAIN_NAME' not found.");
    })(),
  amplify: {
    buildSettings: {
      buildEnv: "production",
    },
    domainSettings: {
      domainName: "sarahbonzelet.de",
      subdomain: "www",
    },
    github: {
      branch: process.env.AMPLIFY_GITHUB_BRANCH || "main",
      oauthSecretName: process.env.AMPLIFY_GITHUB_OAUTHSECRET_NAME || "",
    },
  },
};
