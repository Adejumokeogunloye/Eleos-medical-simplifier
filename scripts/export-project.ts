import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const backupsDirectory = join(projectRoot, "backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = join(backupsDirectory, `${basename(projectRoot)}-${timestamp}.zip`);

if (process.env.EXPORT_PROJECT_ADMIN !== "1" || !process.argv.includes("--confirm")) {
  console.error("This local backup command requires EXPORT_PROJECT_ADMIN=1 and the --confirm flag.");
  console.error("Example: set EXPORT_PROJECT_ADMIN=1 && npm run export:project -- --confirm");
  process.exit(1);
}

if (process.platform !== "win32") {
  console.error("This utility currently uses Windows tar.exe. Run it from a Windows administrator-controlled machine.");
  process.exit(1);
}

if (!existsSync(backupsDirectory)) mkdirSync(backupsDirectory, { recursive: true });

// This script is intentionally local-only. No project source is uploaded anywhere.
execFileSync("tar.exe", [
  "-a", "-c", "-f", outputPath,
  "--exclude=node_modules", "--exclude=.env", "--exclude=.env.*", "--exclude=.next",
  "--exclude=out", "--exclude=build", "--exclude=work", "--exclude=.pnpm-store",
  "--exclude=.git", "--exclude=backups", "-C", projectRoot, ".",
], { stdio: "inherit" });

console.log(`Project backup created: ${outputPath}`);
