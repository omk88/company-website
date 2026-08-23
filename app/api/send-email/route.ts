import { NextResponse } from "next/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/ses";

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    const command = new SendEmailCommand({
      Source: "hello@notifications.taqtiq.tech",
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `<p>${body}</p>`,
            Charset: "UTF-8",
          },
          Text: {
            Data: body,
            Charset: "UTF-8",
          },
        },
      },
    });

    const response = await sesClient.send(command);
    return NextResponse.json({ success: true, messageId: response.MessageId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}