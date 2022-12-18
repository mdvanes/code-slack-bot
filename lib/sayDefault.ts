import { AppMentionEvent, SayFn } from "@slack/bolt";

export const sayDefault = async (say: SayFn, event: AppMentionEvent) => {
  await say({
    thread_ts: event.thread_ts,
    text: `Hi <@${event.user}>! Try saying "Hi Cody!"`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          // NOTE: without <@ only the user id is shown.
          text: `Hi <@${event.user}>! Try saying _"Hi Cody!"_`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Help",
            emoji: true,
          },
          value: "Help",
          action_id: "cody_help_button",
        },
      },
    ],
  });
};


