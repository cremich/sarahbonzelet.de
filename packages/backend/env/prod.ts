import "dotenv/config";

export const config = {
  contactFormRecipientEmailAddress: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
  apiDomainName: "api.sarahbonzelet.de",
  hosting: {
    domainSettings: {
      domainName: "sarahbonzelet.de",
      subdomain: "www",
    },
  },
};
