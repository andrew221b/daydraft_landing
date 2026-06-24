import DeviceShowcase from "./phone/DeviceShowcase";
import { TimelineScene, ChecklistScene, TrackerScene, ReportsScene } from "./phone/phoneScenes";

/* Hero device — a real-looking iPhone cycling the four core tabs of the app,
   each screen recreated in code from the product. The tracker scene lights up
   the Dynamic Island with a live earnings activity. */
export default function AnimatedAppMockup() {
  return (
    <DeviceShowcase
      glow="var(--blue)"
      intensity={6}
      dots
      scenes={[
        { key: "timeline", Comp: TimelineScene, duration: 4800 },
        { key: "checklist", Comp: ChecklistScene, duration: 5400 },
        { key: "tracker", Comp: TrackerScene, duration: 5800, island: true },
        { key: "reports", Comp: ReportsScene, duration: 5400 },
      ]}
    />
  );
}
