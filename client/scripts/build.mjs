import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { rollup, watch } from "rollup";
import config from "../rollup.config.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");
const watchMode = process.argv.includes("--watch");
const basePath = normalizeBasePath(process.env.PUBLIC_BASE_PATH || "/");

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

function withBasePath(filePath) {
  return `${basePath}${filePath.replace(/^\/+/, "")}`;
}

async function prepareDist() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await cp(path.join(root, "public"), dist, { recursive: true });
  await removeUnusedPublicAssets(path.join(dist, "assets"));
  await cp(path.join(root, "src", "styles.css"), path.join(dist, "styles.css"));

  const buildId = Date.now();
  const sourceHtml = await readFile(path.join(root, "index.html"), "utf8");
  const html = sourceHtml
    .replace('/src/main.jsx', `${withBasePath("/assets/app.js")}?v=${buildId}`)
    .replace('/styles.css', `${withBasePath("/styles.css")}?v=${buildId}`)
    .replace('/assets/generated-home-hero.webp', withBasePath("/assets/generated-home-hero.webp"))
    .replace("</head>", `    <meta name="blinkride-base-path" content="${basePath}" />\n  </head>`);
  await writeFile(path.join(dist, "index.html"), html);
  await writeFile(path.join(dist, "404.html"), html);
}

async function removeUnusedPublicAssets(assetDir) {
  const entries = await readdir(assetDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && (/\.jpe?g$/i.test(entry.name) || entry.name === "generated-home-hero.png"))
      .map((entry) => rm(path.join(assetDir, entry.name), { force: true }))
  );
}

async function buildOnce() {
  await prepareDist();
  const bundle = await rollup(config);
  await bundle.write(config.output);
  await bundle.close();
  await rewriteBundleAssetPaths();
  console.log("Client built to dist/");
}

async function rewriteBundleAssetPaths() {
  if (basePath === "/") {
    return;
  }

  const appPath = path.join(dist, "assets", "app.js");
  const app = await readFile(appPath, "utf8");
  const rewritten = app
    .replaceAll('"/assets/', `"${withBasePath("/assets/")}`)
    .replaceAll("'/assets/", `'${withBasePath("/assets/")}`);
  await writeFile(appPath, rewritten);
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
