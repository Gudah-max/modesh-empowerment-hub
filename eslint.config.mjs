import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [{
    // The Sanity Studio is a separate app with its own dependencies and is not
    // part of the website build.
    ignores: ["studio/**", ".next/**"],
}, ...compat.extends("next")];

export default config;
