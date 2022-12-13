import { AppMentionEvent, SayFn } from "@slack/bolt";
import { getOpenAIInstance } from "./queryOpenAI";

export const sayPaint = async (
  paint: string,
  say: SayFn,
  event: AppMentionEvent
) => {
  console.log("Starting sayPaint");

  const openai = await getOpenAIInstance();

  const result = await openai.createImage({
    prompt: paint,
    n: 1,
    size: "512x512",
  });
  const image_url = result.data.data[0].url;

  await say({
    thread_ts: event.thread_ts,
    // text: "PAINT: " + paint,
    text: paint,
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: paint,
        },
      },
      {
        type: "image",
        image_url,
        // image_url:
        //   "https://cdn.openai.com/API/images/guides/image_generation_simple.webp",
        alt_text: paint,
      },
    ],
  });
  console.log("Finished sayPaint");
};
