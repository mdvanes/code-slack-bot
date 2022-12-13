import {
  AllMiddlewareArgs,
  App,
  SlackEventMiddlewareArgs,
  SlackViewMiddlewareArgs,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export type AppMentionProps = SlackEventMiddlewareArgs<"app_mention"> &
  AllMiddlewareArgs<StringIndexed>;
