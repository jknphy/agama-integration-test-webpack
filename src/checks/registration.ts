import { it, page } from "../lib/helpers";
import { OverviewPage } from "../pages/overview_page";
import {
  ProductRegistrationPage,
  ExtensionHaRegistrationPage,
  CustomRegistrationPage,
} from "../pages/registration_page";

import { SidebarWithRegistrationPage } from "../pages/sidebar_page";

interface RegistratinOptions {
  code?: string;
  provide_code?: string;
  url?: string;
}

export function enterRegistration({ code, provide_code, url }: RegistratinOptions): void {
  it("should allow setting registration", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const productRegistration = new ProductRegistrationPage(page);
    await sidebar.goToRegistration();
    const custom = url || provide_code;

    if (custom) {
      if (url) {
        const customRegistration = new CustomRegistrationPage(page);
        await customRegistration.selectCustomRegistrationServer();
        await customRegistration.fillServerUrl(url);
      }
      if (provide_code) {
        await productRegistration.selectProvideRegistrationCode();
        await productRegistration.fillCode(code);
      }
    } else {
      await productRegistration.fillCode(code);
    }
    await productRegistration.register();
    await new OverviewPage(page).waitVisible(40000);
  });

  it("should display product has been registered", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const productRegistration = new ProductRegistrationPage(page);

    await sidebar.goToRegistration();
    await productRegistration.verifyCustomRegistration();
  });
}

export function enterRegistrationHa(code: string) {
  it("should allow setting registration HA", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const extensionRegistration = new ExtensionHaRegistrationPage(page);

    await sidebar.goToRegistration();
    await extensionRegistration.fillCode(code);
    await extensionRegistration.register();
    await extensionRegistration.verifyExtensionRegistration();
  });
}

export function enterCustomRegistrationServer(url: string) {
  it(`should allow setting setting custom registration server to ${url}`, async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const customRegistration = new CustomRegistrationPage(page);

    await sidebar.goToRegistration();
    await customRegistration.selectCustomRegistrationServer();
    await customRegistration.fillServerUrl(url);
    await customRegistration.register();
    await new OverviewPage(page).waitVisible(40000);
  });

  it("should display product has been registered", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const customRegistration = new CustomRegistrationPage(page);

    await sidebar.goToRegistration();
    await customRegistration.verifyCustomRegistration();
  });
}
