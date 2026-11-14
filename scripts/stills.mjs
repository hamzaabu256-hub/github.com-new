// Check stills before rendering: node scripts/stills.mjs 1 2 3 [--frame=20] [--ep=ep1]
// Bundles once, then renders one still per shot into out/stills/sNN.png. Look at every one before you render.
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
const args = process.argv.slice(2);
const frame = (args.find((a) => a.startsWith("--frame=")) || "--frame=20").split("=")[1];
const arg = (k, d) => (args.find((a) => a.startsWith("--" + k + "=")) || "--" + k + "=" + d).split("=")[1];
const comp = arg("comp", "Shot"), gl = arg("gl", ""), par = Number(arg("par", "4"));
const ids = args.filter((a) => !a.startsWith("--"));
fs.mkdirSync("out/stills", { recursive: true });
execSync("npx remotion bundle src/index.ts --out-dir=out/bundle --log=error", { stdio: "inherit" });
const run = (id) => new Promise((ok) => {
  const p = spawn("npx", ["remotion", "still", "out/bundle", comp, `out/stills/s${String(id).padStart(2, "0")}.png`, `--props={"id":${id}}`, `--frame=${frame}`, "--log=error", ...(gl ? [`--gl=${gl}`, "--timeout=300000", "--concurrency=1"] : [])], { stdio: "inherit", shell: process.platform === "win32" });
  p.on("close", ok);
});
for (let i = 0; i < ids.length; i += par) await Promise.all(ids.slice(i, i + par).map(run));
console.log("stills in out/stills:", ids.map((i) => `s${String(i).padStart(2, "0")}.png`).join(" "));
