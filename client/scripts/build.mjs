import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { rollup, watch } from "rollup";
import config from "../rollup.config.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");
const watchMode = process.argv.includes("--watch");

async function prepareDist() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await cp(path.join(root, "public"), dist, { recursive: true });
  await cp(path.join(root, "src", "styles.css"), path.join(dist, "styles.css"));

  const buildId = Date.now();
  const sourceHtml = await readFile(path.join(root, "index.html"), "utf8");
  const html = sourceHtml
    .replace('/src/main.jsx', `/assets/app.js?v=${buildId}`)
    .replace('/styles.css', `/styles.css?v=${buildId}`);
  await writeFile(path.join(dist, "index.html"), html);
}

async function buildOnce() {
  await prepareDist();
  const bundle = await rollup(config);
  await bundle.write(config.output);
  await bundle.close();
  console.log("Client built to dist/");
}

if (watchMode) {
  await prepareDist();
  const watcher = watch({
    ...config,
    watch: {
      clearScreen: false,
      include: "src/**"
    }
  });

  watcher.on("event", async (event) => {
    if (event.code === "START") {
      await prepareDist();
      console.log("Rebuilding client...");
    }

    if (event.code === "BUNDLE_END") {
      console.log(`Client rebuilt in ${event.duration}ms`);
    }

    if (event.code === "ERROR") {
      console.error(event.error);
    }
  });
} else {
  await buildOnce();
}
