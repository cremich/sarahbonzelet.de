import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as XRAY from "aws-xray-sdk-core";
import { SESv2 } from "@aws-sdk/client-sesv2";

const sesClient = XRAY.captureAWSv3Client(new SESv2({}));

interface ContactRequestBody {
  senderEmail: string;
  message: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
  if (!process.env.SES_TARGET_EMAIL) {
    throw Error("SES_TARGET_EMAIL not set");
  }

  if (event.body) {
    const contactRequestBody: ContactRequestBody = JSON.parse(event.body);
    await sesClient.sendEmail({
      Destination: {
        ToAddresses: [process.env.SES_TARGET_EMAIL],
      },
      FromEmailAddress: process.env.SES_TARGET_EMAIL,
      Content: {
        Simple: {
          Subject: {
            Data: "Kundenanfrage über sarahbonzelet.de",
          },
          Body: {
            Text: {
              Data: contactRequestBody.message,
            },
          },
        },
      },
    });
  }

  return {};
};
