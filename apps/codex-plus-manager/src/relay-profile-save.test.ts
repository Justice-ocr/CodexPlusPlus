import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("relay profile saving", () => {
  it("persists settings and synchronizes active relay files", async () => {
    const app = await readFile(new URL("./App.tsx", import.meta.url), "utf8");
    const commands = await readFile(new URL("../src-tauri/src/commands.rs", import.meta.url), "utf8");
    const saveStart = app.indexOf("const saveDraft = async () =>");
    const saveEnd = app.indexOf("const switchDraft = () =>", saveStart);
    const saveDraft = app.slice(saveStart, saveEnd);

    assert.ok(saveStart >= 0);
    assert.ok(saveEnd > saveStart);
    assert.match(saveDraft, /await onFormChange\(next\)/);
    assert.match(saveDraft, /actions\.saveRelayFile\(\s*[\"']config[\"']/);
    assert.match(saveDraft, /actions\.saveRelayFile\(\s*[\"']auth[\"']/);
    assert.match(commands, /pub fn save_relay_file\(/);
  });
});
