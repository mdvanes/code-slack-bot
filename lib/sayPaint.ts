import { createWriteStream } from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import { getOpenAIInstance } from "./queryOpenAI";
import { sayLoading } from "./sayLoading";
import { AppMentionProps } from "./types";

const pipeline = promisify(stream.pipeline);

export const sayPaint = async (props: AppMentionProps, paint: string) => {
  const { event, client, logger } = props;
  logger.info("Starting sayPaint");
  const loadingMsg = await sayLoading(props);

  const openai = await getOpenAIInstance();

  // WARNING: these images are cleaned up after an hour or so from the CDN, so convert to inline image
  const result = await openai.createImage({
    prompt: paint,
    n: 1,
    size: "512x512",
  });
  const image_url = result.data.data[0].url;
  // console.log(image_url);

  // const image_url =
  //   "https://cdn.openai.com/API/images/guides/image_generation_simple.webp";

  await pipeline(got.stream(image_url), createWriteStream("./image.webp"));

  await client.files.uploadV2({
    channel_id: loadingMsg.channel,
    thread_ts: event.thread_ts,
    initial_comment: `I painted ${paint} :art:`,
    file: "./image.webp",
    filename: `${paint}.webp`,
  });

  await client.chat.delete({
    thread_ts: event.thread_ts,
    channel: loadingMsg.channel,
    ts: loadingMsg.ts,
  });
  logger.info("Finished sayPaint");
};
