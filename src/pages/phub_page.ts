import { type Page } from "puppeteer-core";

export class PhubPage {
  private readonly page: Page;
  protected readonly registerButton = () => this.page.locator("[id*='register-button-PackageHub']");

  readonly registeredText = () =>
    this.page.locator("::-p-text(The extension was registered without any registration code)");

  constructor(page: Page) {
    this.page = page;
  }

  async register() {
    await this.registerButton().click();
  }
}
