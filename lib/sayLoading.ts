import { AppMentionEvent, SayFn } from "@slack/bolt";
import { AppMentionProps } from "./types";

export const sayLoading = async ({ say, event }: AppMentionProps) => {
  await say({
    thread_ts: event.thread_ts,
    text: "...",
  });
};
