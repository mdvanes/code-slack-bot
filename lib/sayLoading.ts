import { AppMentionProps } from "./types";

export const sayLoading = async ({ say, event }: AppMentionProps) => {
  return say({
    thread_ts: event.thread_ts,
    text: ":speech_balloon:",
  });
};
