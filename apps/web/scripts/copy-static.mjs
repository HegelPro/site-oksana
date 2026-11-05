import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const appRoot = process.cwd();
const target = join(appRoot, ".next", "standalone", "apps", "web", ".next", "static");
mkdirSync(target, { recursive: true });
cpSync(join(appRoot, ".next", "static"), target, { recursive: true });
cpSync(join(appRoot, "public"), join(appRoot, ".next", "standalone", "apps", "web", "public"), {
  recursive: true,
});
