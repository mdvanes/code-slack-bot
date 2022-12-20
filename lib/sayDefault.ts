import { AppMentionProps } from "./types";
import { logDate } from "./util";

export const sayDefault = async ({ say, event, logger }: AppMentionProps) => {
  logger.info(`${logDate()} Responding to DEFAULT`);
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
