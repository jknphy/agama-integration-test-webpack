import { type Page } from "puppeteer-core";

export class UsersPage {
  private readonly page: Page;
  private readonly firstUserLink = () => this.page.locator("a[href='#/users/first']");
  private readonly setAPasswordButton = () => this.page.locator("button::-p-text(Set a password)");
  private readonly editARootButton = () => this.page.locator("a[href='#/users/root/edit']");
  private readonly editAFirstButton = () => this.page.locator("a[href='#/users/first/edit']");

  constructor(page: Page) {
    this.page = page;
  }

  async defineAUserNow() {
    await this.firstUserLink().click();
  }

  async setAPassword() {
    await this.setAPasswordButton().click();
  }

  async editARootPassword() {
    await this.editARootButton().click();
  }

  async editAFirstPassword() {
    await this.editAFirstButton().click();
  }
}
