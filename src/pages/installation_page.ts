import { type Page } from "puppeteer-core";

export class InstallationPage {
  private readonly page: Page;
  private readonly prepareDisksText = () => this.page.locator("::-p-text(Prepare disks)");
  private readonly installingSystemText = () =>
    this.page.locator("::-p-text(Installing the system, please wait...)");

  private readonly installSoftwareText = () => this.page.locator("::-p-text(Install software)");
  private readonly configureTheSystemText = () =>
    this.page.locator("::-p-text(Configure the system)");

  constructor(page: Page) {
    this.page = page;
  }

  async prepareDisks() {
    return await this.prepareDisksText()
      .map((element) => element.textContent)
      .wait();
  }

  async installingSystem() {
    return await this.installingSystemText()
      .map((element) => element.textContent)
      .wait();
  }

  async installSoftware() {
    return await this.installSoftwareText()
      .map((element) => element.textContent)
      .wait();
  }

  async configureTheSystem() {
    return await this.configureTheSystemText()
      .map((element) => element.textContent)
      .wait();
  }
}
