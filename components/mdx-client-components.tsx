"use client";

import dynamic from "next/dynamic";

export const TaskSimulator = dynamic(() =>
  import("./interactive-components/task-simulator").then((mod) => mod.TaskSimulator)
);
export const RaceConditionVisualizer = dynamic(() =>
  import("./interactive-components/race-condition-visualizer").then(
    (mod) => mod.RaceConditionVisualizer
  )
);
export const GoroutineScheduler = dynamic(() =>
  import("./interactive-components/goroutine-scheduler").then(
    (mod) => mod.GoroutineScheduler
  )
);
export const ChannelSimulator = dynamic(() =>
  import("./interactive-components/channel-simulator").then(
    (mod) => mod.ChannelSimulator
  )
);
export const UnbufferedChannelDemo = dynamic(() =>
  import("./interactive-components/unbuffered-channel").then(
    (mod) => mod.UnbufferedChannelDemo
  )
);
export const RealtimeAudioFlow = dynamic(() =>
  import("./interactive-components/realtime-audio-flow").then(
    (mod) => mod.RealtimeAudioFlow
  )
);
export const CodePlayground = dynamic(() =>
  import("./interactive-components/code-playground").then(
    (mod) => mod.CodePlayground
  )
);
