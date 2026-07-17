import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

function replaceNodeEnv() {
  return {
    name: "replace-node-env",
    transform(code) {
      if (!code.includes("process.env.NODE_ENV")) {
        return null;
      }

      return {
        code: code.replaceAll("process.env.NODE_ENV", '"production"'),
        map: null
      };
    }
  };
}

export default {
  input: "src/main.jsx",
  output: {
    file: "dist/assets/app.js",
    format: "iife",
    name: "BlinkRideApp",
    sourcemap: false
  },
  plugins: [
    replaceNodeEnv(),
    resolve({
      browser: true,
      extensions: [".mjs", ".js", ".jsx", ".json"]
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx"],
      presets: [["@babel/preset-react", { runtime: "automatic" }]],
      exclude: "node_modules/**"
    })
  ]
};
