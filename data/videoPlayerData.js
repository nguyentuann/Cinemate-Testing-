export const videoPlayerTestCases = [
  {
    testName: "Play/Pause Button",
    actions: ["pause", "play"],
    description: "Test play and pause functionality"
  },
  {
    testName: "Forward 10s Button",
    actions: ["forward"],
    description: "Test forward 10 seconds"
  },
  {
    testName: "Backward 10s Button",
    actions: ["backward"],
    description: "Test backward 10 seconds"
  },
  {
    testName: "Quality Selection",
    actions: ["quality"],
    qualities: ["1080p", "720p", "360p", "Auto"],
    description: "Test quality selection"
  },
  {
    testName: "Speed Control",
    actions: ["speed"],
    description: "Test playback speed"
  },
  {
    testName: "Silent/Sound Toggle",
    actions: ["silent"],
    description: "Test mute/unmute"
  },
  {
    testName: "Lock/Unlock Controls",
    actions: ["lock", "unlock"],
    description: "Test lock controls"
  },
  {
    testName: "Close Video",
    actions: ["close"],
    description: "Test close button"
  }
];
