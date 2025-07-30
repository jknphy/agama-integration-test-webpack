import { type Page } from "puppeteer-core";

export class TrustKeyPage {
  private readonly page: Page;
  private readonly trustKeyText = () =>
    this.page.locator("::-p-text(Do you want to trust this key?)");

  private readonly trustKeyButton = () => this.page.locator("button::-p-text(Trust)");

  constructor(page: Page) {
    this.page = page;
  }

  async trustKey() {
    await this.trustKeyButton().click();
  }
}
