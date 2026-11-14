import { useState } from "react";
import { useMenu } from "../context/MenuContext.jsx";
import { DEFAULT_DEMO, readDemoFlags, saveDemoFlags } from "../services/menuApi.js";

// Switches used to show edge cases during assessment. Each change saves the flag
// and reloads the menu, so the loader (menuApi.loadMenu) applies it.
export default function DemoControls() {
  const { reload } = useMenu();
  const [flags, setFlags] = useState(readDemoFlags);

  function update(next) {
    setFlags(next);
    saveDemoFlags(next);
    reload();
  }

  const toggle = (name) => (e) => update({ ...flags, [name]: e.target.checked });

  return (
    <fieldset className="demo-controls">
      <legend>Demo controls — for assessment</legend>
      <div className="field field--check">
        <input id="demo-fail" type="checkbox" checked={flags.fail} onChange={toggle("fail")} />
        <label htmlFor="demo-fail">Simulate loading failure</label>
      </div>
      <div className="field field--check">
        <input id="demo-changed" type="checkbox" checked={flags.changed} onChange={toggle("changed")} />
        <label htmlFor="demo-changed">Simulate changed availability (Chicken Tikka sells out, Fries low)</label>
      </div>
      <div className="field field--check">
        <input id="demo-empty" type="checkbox" checked={flags.empty} onChange={toggle("empty")} />
        <label htmlFor="demo-empty">Simulate empty catalogue</label>
      </div>
      <button type="button" className="btn btn--secondary" onClick={() => update({ ...DEFAULT_DEMO })}>
        Reset demo controls
      </button>
    </fieldset>
  );
}
