import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
  apiDomainName: "api-dev.sarahbonzelet.de",
  hosting:
    process.env.HOSTING_ENABLED === "true"
      ? {
          domainSettings: {
            domainName: "sarahbonzelet.de",
            subdomain: "dev",
          },
          accessControlSettings: {
            globalBasicAuth: true,
          },
        }
      : undefined,
};
