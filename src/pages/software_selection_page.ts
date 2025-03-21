import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckbox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][rowid=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  // SELinux was auto selected, click will unselect it.
  async clickIfNotChecked(selector: string, pattern: string) {
    const checkbox = await this.page.$(selector);
    const isChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    if (!isChecked) {
      await checkbox.click();
    } else {
      console.log(`Pattern was auto selected: ${pattern}`);
    }
  }

  async selectPattern(pattern: string) {
    const checkboxSelector = `input[type=checkbox][rowid=${pattern}-title]`;
    const checkbox = await this.patternCheckbox(pattern).waitHandle();

    await checkbox.scrollIntoView();
    await this.clickIfNotChecked(checkboxSelector, pattern);

    // Wait for the checkbox to be checked.
    await this.page.waitForSelector(`${checkboxSelector}:checked`);

    // This is useful when some patterns are not available on some arches.
    console.log(`Selected pattern: ${pattern}`);
  }

  async close() {
    await this.closeButton().click();
  }
}
