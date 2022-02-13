import { mockClient } from "aws-sdk-client-mock";
import { SendEmailCommand, SESv2 } from "@aws-sdk/client-sesv2";
import { handler } from "../../../../lib/contact-form/lambdas/send-email";
import { APIGatewayProxyEvent } from "aws-lambda";

const sesMock = mockClient(SESv2);

const apiGWEventDefaults: APIGatewayProxyEvent = {
  body: "",
  headers: {},
  multiValueHeaders: {},
  httpMethod: "",
  isBase64Encoded: false,
  path: "",
  pathParameters: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  stageVariables: {},
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: {},
    protocol: "",
    httpMethod: "",
    identity: {
      accessKey: "",
      accountId: "",
      apiKey: "",
      apiKeyId: "",
      caller: "",
      clientCert: {
        clientCertPem: "",
        serialNumber: "",
        subjectDN: "",
        issuerDN: "",
        validity: {
          notAfter: "",
          notBefore: "",
        },
      },
      user: "",
      userAgent: "",
      userArn: "",
      cognitoIdentityId: "",
      cognitoIdentityPoolId: "",
      principalOrgId: "",
      sourceIp: "",
      cognitoAuthenticationProvider: "",
      cognitoAuthenticationType: "",
    },
    path: "",
    stage: "",
    requestId: "",
    requestTimeEpoch: 0,
    resourceId: "",
    resourcePath: "",
  },
  resource: "",
};

const targetEmailAddress = "me@example.com";

describe("Send email lambda", () => {
  beforeEach(() => {
    sesMock.reset();
    delete process.env.SES_TARGET_EMAIL;

    sesMock.on(SendEmailCommand).resolves({});
  });

  it("Email is sent to target email address ", async () => {
    process.env.SES_TARGET_EMAIL = targetEmailAddress;
    const event: APIGatewayProxyEvent = {
      ...apiGWEventDefaults,
      body: "{}",
    };
    await handler(event);
    expect(sesMock.calls()).toHaveLength(1);
    expect(sesMock.call(0).args[0].input).toStrictEqual({
      Destination: {
        ToAddresses: [targetEmailAddress],
      },
      FromEmailAddress: targetEmailAddress,
      Content: {
        Simple: {
          Subject: {
            Data: "Kundenanfrage über sarahbonzelet.de",
          },
          Body: {
            Text: {
              Data: undefined,
            },
          },
        },
      },
    });
  });

  it("Error is thrown if SES_TARGET_EMAIL not set ", async () => {
    const event: APIGatewayProxyEvent = {
      ...apiGWEventDefaults,
      body: "{}",
    };
    await expect(handler(event)).rejects.toThrow("SES_TARGET_EMAIL not set");
  });
  it("Request to SES is bypassed if not body was sent ", async () => {
    process.env.SES_TARGET_EMAIL = targetEmailAddress;
    const event: APIGatewayProxyEvent = {
      ...apiGWEventDefaults,
      body: null,
    };
    await handler(event);
    expect(sesMock.calls()).toHaveLength(0);
  });
});
