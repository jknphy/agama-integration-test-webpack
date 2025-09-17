import { it, page, getTextContent } from "../lib/helpers";
import { OverviewPage } from "../pages/overview_page";
import {
  ProductRegistrationPage,
  ExtensionHaRegistrationPage,
  CustomRegistrationPage,
  ExtensionPhubRegistrationPage,
} from "../pages/registration_page";
import { ConnectionToRegistrationServerFailedAlert } from "../pages/connection_to_registration_server_failed_alert";

import assert from "node:assert/strict";

import { TrustKeyPage } from "../pages/trust_key_page";
import { SidebarWithRegistrationPage } from "../pages/sidebar_page";

interface RegistratinOptions {
  use_custom?: string;
  code?: string;
  provide_code?: string;
  url?: string;
}

export function enterRegistration({
  use_custom,
  code,
  provide_code,
  url,
}: RegistratinOptions): void {
  it("should allow setting registration", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const productRegistration = new ProductRegistrationPage(page);
    await sidebar.goToRegistration();

    if (use_custom) {
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
    assert.match(
      await getTextContent(extensionRegistration.extensionRegisteredText()),
      /The extension has been registered/,
    );
  });
}

export function registerPackageHub() {
  it("should allow register PackageHub", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const extensionRegistration = new ExtensionPhubRegistrationPage(page);
    const packagehubTrustKey = new TrustKeyPage(page);

    await sidebar.goToRegistration();
    await extensionRegistration.register();
    assert.match(
      await getTextContent(packagehubTrustKey.trustKeyText()),
      /is unknown. Do you want to trust this key?/,
    );
    await packagehubTrustKey.trustKey();
    assert.deepEqual(
      await getTextContent(extensionRegistration.extensionRegisteredText()),
      "The extension was registered without any registration code.",
    );
  });
}

export function registrationWarningAlert() {
  const productRegistration = new ProductRegistrationPage(page);
  const customRegistration = new CustomRegistrationPage(page);
  const serverFailedAlertPage = new ConnectionToRegistrationServerFailedAlert(page);
  const invalid_regcode = "123XX432";

  it(`should popup register warning alert for invalid registration code`, async function () {
    await productRegistration.fillCode(invalid_regcode);
    await productRegistration.register();
    assert.deepEqual(
      await getTextContent(serverFailedAlertPage.connectionToRegistrationServerFailedText()),
      "Connection to registration server failed: Unknown Registration Code.",
    );
  });

  const invalidUrls = ["http://scc.example.net", "https://scc.example.net"];
  invalidUrls.forEach((invalidUrl) => {
    const protocol = invalidUrl.startsWith("https") ? "https" : "http";
    it(`should popup register warning alert for invalid ${protocol} registration server`, async function () {
      await customRegistration.selectCustomRegistrationServer();
      await customRegistration.fillServerUrl(invalidUrl);
      await productRegistration.register();

      assert.match(
        await getTextContent(serverFailedAlertPage.connectionToRegistrationServerFailedText()),
        /Connection to registration server failed: dial tcp: lookup .+ on .+: no such host \(network error\)/,
      );
    });
  });
}
