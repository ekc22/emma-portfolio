/** Deletes the local demo store; the app re-seeds it on next request. */
import fs from "node:fs";
import path from "node:path";
const file = path.join(process.cwd(), ".data", "cos-os.json");
fs.rmSync(file, { force: true });
console.log("Demo data reset. It will be re-created from the seed on the next page load.");
