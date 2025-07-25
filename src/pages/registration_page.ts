import { Locator, type Page } from "puppeteer-core";
import { type GConstructor } from "../lib/helpers";

class RegistrationBasePage {
  protected readonly page: Page;
  protected readonly codeInput: () => Locator<HTMLInputElement>;
  protected readonly registerButton = () => this.page.locator("button::-p-text(Register)");
  protected readonly extensionRegisteredText = () =>
    this.page.locator("::-p-text(The extension has been registered)");

  constructor(page: Page) {
    this.page = page;
  }

  async fillCode(code: string) {
    await this.codeInput().fill(code);
  }

  async register() {
    await this.registerButton().click();
  }
}

function ProductRegistrable<TBase extends GConstructor<RegistrationBasePage>>(Base: TBase) {
  return class extends Base {
    codeInput = () => this.page.locator(`input[id="code"], input[id="key"]`);
  };
}

function ExtensionHaRegistrable<TBase extends GConstructor<RegistrationBasePage>>(Base: TBase) {
  return class extends Base {
    codeInput = () => this.page.locator("input[id^='input-reg-code-sle-ha-16.']");
    extensionRegisteredText = () =>
      this.page.locator("::-p-text(The extension has been registered)");

    async verifyExtensionRegistration() {
      await this.extensionRegisteredText().wait();
    }
  };
}

function CustomRegistrable<TBase extends GConstructor<RegistrationBasePage>>(Base: TBase) {
  return class extends Base {
    codeInput = () => this.page.locator("input#code");

    private readonly serverButton = () => this.page.locator("#server");
    private readonly sccOption = () =>
      this.page.locator("::-p-text(SUSE Customer Center \\(SCC\\)Register)");

    // Filed bug for this locator.
    private readonly customOption = () => this.page.locator("::-p-text(Register using a)");
    private readonly customPasswordCheckbox = () => this.page.locator("input#provide-code");
    private readonly customURLInput = () => this.page.locator("input#url");

    async configureCustomRegistration(url: string, regcode?: string) {
      await this.serverButton().click();
      await this.page.waitForSelector('[aria-label="Server options"]', { visible: true });

      await this.customOption().wait();
      await this.customOption().click();

      await this.page.waitForSelector("input#url", { visible: true });
      await this.customURLInput().fill(url);

      if (regcode) {
        await this.customPasswordCheckbox().click();
        await this.page.waitForSelector("input#code", { visible: true });
        await this.codeInput().fill(regcode);
      }
    }

    async verifyCustomRegistration(url: string) {
      await this.page.locator("::-p-text(has been registered with below information)").wait();
      await this.page.locator(`::-p-text(${url})`).wait();
    }
  };
}

export class ProductRegistrationPage extends ProductRegistrable(RegistrationBasePage) {}
export class ExtensionHaRegistrationPage extends ExtensionHaRegistrable(RegistrationBasePage) {}
export class CustomRegistrationPage extends CustomRegistrable(RegistrationBasePage) {}
