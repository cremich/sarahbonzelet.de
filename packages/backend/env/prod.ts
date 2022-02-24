import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
  apiDomainName: "api.sarahbonzelet.de",
  amplify: {
    buildSettings: {
      buildEnv: "production",
    },
    domainSettings: {
      domainName: "sarahbonzelet.de",
      subdomain: "www",
    },
    github: {
      branch: "main",
      oauthSecretName: "github-token",
    },
  },
};
