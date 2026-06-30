"use client";

import dynamic from "next/dynamic";

const ExitIntentPrompt = dynamic(() => import("./exit-intent-prompt").then((m) => ({ default: m.ExitIntentPrompt })), {
  ssr: false,
});

export function ExitIntentWrapper() {
  return <ExitIntentPrompt />;
}
