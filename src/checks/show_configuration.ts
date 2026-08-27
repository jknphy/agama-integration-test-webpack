import { it, page, readClipboard, waitOnNewFile } from "../lib/helpers";
import fs from "fs";
import os from "os";
import path from "path";
import assert from "node:assert/strict";
import { InstallationSettingsInJsonFormatPage } from "../pages/installation_settings_in_json_format_page";

export function showConfiguration() {
  it("should show, copy, download and close the installation configuration", async function () {
    const installationSettingsInJsonFormat = new InstallationSettingsInJsonFormatPage(page);

    await installationSettingsInJsonFormat.open();
    const displayedConfiguration = await installationSettingsInJsonFormat.displayedConfiguration();
    assert(
      displayedConfiguration.includes('"product"'),
      `Displayed configuration has no product section: ${displayedConfiguration}`,
    );
    assert(
      displayedConfiguration.includes('"id"'),
      `Displayed configuration has no product id: ${displayedConfiguration}`,
    );

    await installationSettingsInJsonFormat.copyToClipboard();
    const copiedConfiguration = await readClipboard();
    assert(
      copiedConfiguration.includes('"product"'),
      `Copied configuration has no product section: ${copiedConfiguration}`,
    );

    const downloadedFile = await waitOnNewFile(
      () => installationSettingsInJsonFormat.downloadConfiguration(),
      path.join(os.homedir(), "Downloads"),
      "agama-config-",
    );
    const downloadedConfiguration = fs.readFileSync(downloadedFile, "utf8");
    assert(
      downloadedConfiguration.includes('"product"'),
      `Downloaded configuration has no product section: ${downloadedConfiguration}`,
    );

    await installationSettingsInJsonFormat.close();
    await installationSettingsInJsonFormat.waitUntilClosed();
  });
}
