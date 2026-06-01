"use client";

import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

const PLUGIN_KEY =
  process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY ??
  "0dc5cec0-91d0-4ea2-b8d8-f7af804b30c9";

export function ChannelTalk() {
  useEffect(() => {
    if (!PLUGIN_KEY) return;

    ChannelService.loadScript();
    ChannelService.boot({ pluginKey: PLUGIN_KEY });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return null;
}
