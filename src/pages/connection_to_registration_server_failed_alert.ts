import { type Page } from "puppeteer-core";

export class ConnectionToRegistrationServerFailedAlert {
  protected readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  readonly connectionToRegistrationServerFailedText = () =>
    this.page.locator("::-p-text(Connection to registration server failed:)");
}
