import { type Page } from "puppeteer-core";

export class InstallPage {
  private readonly page: Page;
  private readonly installingSpinner = `svg.pf-m-xl[role="progressbar"]`;

  constructor(page: Page) {
    this.page = page;
  }

  async waitInstallBegin() {
    await this.page.waitForSelector(this.installingSpinner);
  }

  async waitInstallFinish(): Promise<void> {
    const checkInterval = 10000; // 10 seconds
    const maxTimeout = 900000; // 15 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeout) {
      try {
        await this.page.waitForSelector(this.installingSpinner, {
          hidden: true,
          timeout: checkInterval,
        });
        const timeTaken = (Date.now() - startTime) / 1000;
        console.log(`Installation completed. Time taken: ${timeTaken} seconds.`);
        return; // Spinner disappeared
      } catch {
        // Continue the loop if the spinner is still visible after the checkInterval
      }
      // Wait checkInterval before the next check
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }
    throw new Error("Spinner did not disappear within the timeout period");
  }
}
