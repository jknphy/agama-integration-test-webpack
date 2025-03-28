import { type Page } from "puppeteer-core";

export class AutoyastUnsupportedPage {
  private readonly page: Page;
  private readonly abortButton = () => this.page.locator("button::-p-text(Abort)");
  private readonly continueButton = () => this.page.locator("button::-p-text(Continue)");
  private readonly titleText = () => this.page.locator("::-p-text(Unsupported AutoYaST elements)");
  private readonly notImplementedText = (num: number) =>
    this.page.locator(`::-p-text(Not implemented yet (${num}))`);

  private readonly notSupportedText = (element: string) =>
    this.page.locator(`::-p-text(${element})`);

  constructor(page: Page) {
    this.page = page;
  }

  async abort() {
    await this.abortButton().click();
  }

  async continue() {
    await this.continueButton().click();
  }

  async verifyTitle() {
    await this.titleText().wait();
  }

  async verifyNotImplementedText(num: number) {
    await this.notImplementedText(num).wait();
  }

  async verifyNotSupportedText(element: string) {
    await this.notSupportedText(element).wait();
  }
}
