import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export const publishAppHome = (
  props: SlackEventMiddlewareArgs<"app_home_opened"> &
    AllMiddlewareArgs<StringIndexed>
) => {
  const { event, client } = props;
  /* view.publish is the method that your app uses to push a view to the Home tab */
  return client.views.publish({
    /* the user that opened your app's app home */
    user_id: event.user,

    /* the view object that appears in the app home*/
    view: {
      type: "home",
      callback_id: "home_view",

      /* body of the view */
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Hi, I am _Cody Starr_* :sunglasses:",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "I am a work in progress :construction:, but then again, who isn't?\nI can answer questions by using <https://openai.com|*OpenAI*>. It's not free, so keep that in mind :smile:",
          },
        },
        // {
        //   "type": "actions",
        //   "elements": [
        //     {
        //       "type": "button",
        //       "text": {
        //         "type": "plain_text",
        //         "text": "Click me!"
        //       }
        //     }
        //   ]
        // }
      ],
    },
  });
};
