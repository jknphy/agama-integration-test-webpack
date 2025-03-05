import { type Page } from "puppeteer-core";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export class OverviewPage {
  private readonly page: Page;
  private readonly installButton = () => this.page.locator("button::-p-text(Install)");
  private readonly mustBeRegisteredText = () => this.page.locator("::-p-text(must be registered)");

  constructor(page: Page) {
    this.page = page;
  }

  async waitWarningAlertToDisappear() {
    await this.mustBeRegisteredText().setVisibility("hidden").wait();
  }

  async install() {
    await this.installButton().click();
  }

  private ensureDirExist(dirPath: string) {
    const resolvedPath = resolve(dirPath);
    if (!existsSync(resolvedPath)) {
      mkdirSync(resolvedPath, { recursive: true });
      console.log(`Directory created: ${resolvedPath}`);
    }
  }

  async takeScreenshot() {
    const screenshotBuffer = await this.page.screenshot();
    this.ensureDirExist("/tmp/agama/screenshots");
    const screenshotPath = resolve("/tmp/agama/screenshots", "overview_screenshot.png");
    writeFileSync(screenshotPath, screenshotBuffer);
  }
}
