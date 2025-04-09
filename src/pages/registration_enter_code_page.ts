import { type Page } from "puppeteer-core";

export class RegistrationEnterCodePage {
  private readonly page: Page;
  private readonly codeInput = () => this.page.locator("input#key");
  private readonly codeHAInput = () => this.page.locator("input[id='reg-code-sle-ha-16.0']");
  private readonly registertButton = () => this.page.locator("button::-p-text(Register)");

  constructor(page: Page) {
    this.page = page;
  }

  async fillCode(code: string) {
    await this.codeInput().fill(code);
  }

  async fillCodeHA(code: string) {
    await this.codeHAInput().fill(code);
  }

  async register() {
    await this.registertButton().click();
  }
}
