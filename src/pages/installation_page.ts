import assert from "node:assert/strict";
import { type Page } from "puppeteer-core";

export class InstallationPage {
  private readonly page: Page;
  private readonly prepareDisksText = () => this.page.locator("::-p-text(Prepare disks)");
  private readonly installingSystemText = () =>
    this.page.locator(`::-p-text(Installing the system, please wait...)`);

  private readonly installSoftwareText = () => this.page.locator(`::-p-text(Install software)`);
  private readonly configureTheSystemText = () =>
    this.page.locator(`::-p-text(Configure the system)`);

  constructor(page: Page) {
    this.page = page;
  }

  async validatePrepareDisks(expectedText: string) {
    assert.deepEqual(
      await this.prepareDisksText()
        .map((element) => element.textContent)
        .wait(),
      expectedText,
    );
  }

  async validateInstallingSystem(expectedText: string) {
    assert.deepEqual(
      await this.installingSystemText()
        .map((element) => element.textContent)
        .wait(),
      expectedText,
    );
  }

  async validateInstallSoftware(expectedText: string) {
    assert.deepEqual(
      await this.installSoftwareText()
        .map((element) => element.textContent)
        .wait(),
      expectedText,
    );
  }

  async validateConfigureTheSystem(expectedText: string) {
    assert.deepEqual(
      await this.configureTheSystemText()
        .map((element) => element.textContent)
        .wait(),
      expectedText,
    );
  }
}
