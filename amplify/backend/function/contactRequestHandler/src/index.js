exports.handler = async event => {
  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'INSERT') {
      //TODO: validate and sanitize inputs
      // //pull off items from stream
      // const candidateName = streamedItem.dynamodb.NewImage.name.S
      // const candidateEmail = streamedItem.dynamodb.NewImage.email.S
      // await ses
      //     .sendEmail({
      //       Destination: {
      //         ToAddresses: [process.env.MAIL_ADDRESS],
      //       },
      //       Source: process.env.MAIL_ADDRESS,
      //       Message: {
      //         Subject: { Data: 'Kundenanfrage via sarahbonzelet.de' },
      //         Body: {
      //           Text: { Data: `My name is ${candidateName}. You can reach me at ${candidateEmail}` },
      //         },
      //       },
      //     })
      //     .promise()
    }
  }
  return { status: 'done' };
};
