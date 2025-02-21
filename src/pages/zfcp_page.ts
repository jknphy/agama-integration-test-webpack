import { type Page } from "puppeteer-core";
import { sleep } from "../lib/helpers";

export class ZfcpPage {
  private readonly page: Page;

  private readonly faDisk = () =>
    this.page.locator("tbody > tr:first-child > td:last-child > button#zfcp_controllers_actions");

  private readonly fcDisk = () =>
    this.page.locator("tbody > tr:last-child > td:last-child > button#zfcp_controllers_actions");

  private readonly activateDisk = () => this.page.locator("::-p-text('Activate')");

  private readonly backToDeviceSelectionButton = () =>
    this.page.locator("button::-p-text(Back to device selection)");

  private readonly enableMultipath = () => this.page.locator("::-p-text('Yes')");

  constructor(page: Page) {
    this.page = page;
  }

  async activateDevice(channelId) {
    let element;
    if (channelId === "0.0.fa00") element = this.faDisk();
    else element = this.fcDisk();

    await element.click();
    await this.activateDisk().click();
    // puppeteer goes too fast and screen is unresponsive after submit, a small delay helps
    await sleep(2000);
    await element.setTimeout(90000).wait();
  }

  async activateMultipath() {
    await this.enableMultipath().setTimeout(40000).click();
  }

  async backToDeviceSelection() {
    await this.backToDeviceSelectionButton().click();
  }
}
