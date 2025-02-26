import { type Page } from "puppeteer-core";

export class SetARootPasswordPage {
  private readonly page: Page;
  private readonly passwordInput = () => this.page.locator("input#password");
  private readonly passwordConfirmationInput = () =>
    this.page.locator("input#passwordConfirmation");

  private readonly rootAuthMethods = () =>
    this.page.locator("label[class='pf-v6-c-switch'] > input[type='checkbox']");

  private readonly confirmText = () => this.page.locator("button::-p-text(Confirm)");
  private readonly acceptText = () => this.page.locator("button::-p-text(Accept)");

  constructor(page: Page) {
    this.page = page;
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async fillPasswordConfirmation(password: string) {
    await this.passwordConfirmationInput().fill(password);
  }

  async confirm() {
    await this.confirmText().click();
  }

  async accept() {
    await this.acceptText().click();
  }

  async useRootPassword() {
    await this.rootAuthMethods().click();
  }
}
