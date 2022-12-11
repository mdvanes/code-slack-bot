import { App } from "@slack/bolt";

export const postSlackMessage = async (msg: string) => {
  const token = "";

  const app = new App({
    token,
    signingSecret: "",
  });

  await app.start();

  try {
    const result = await app.client.chat.postMessage({
      //   token: context.botToken,
      token,
      // Channel to send message to
      channel: "T8BQ26L20", //payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        // {
        //     type: "section",
        //     text: {
        //       type: "mrkdwn",
        //       text: "Go ahead. Click it.",
        //     },
        //     accessory: {
        //       type: "button",
        //       text: {
        //         type: "plain_text",
        //         text: "Click me!",
        //       },
        //       action_id: "button_abc",
        //     },
        //   },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: msg,
          },
        },
      ],
      // Text in the notification
      text: "Message from Cody",
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
