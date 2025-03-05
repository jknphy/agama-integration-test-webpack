import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckBox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][rowid=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  async selectPattern(pattern: string) {
    await this.patternCheckBox(pattern).click();
  }

  async close() {
    await this.closeButton().click();
  }
}
