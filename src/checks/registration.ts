import { it, page, getTextContent, dumpPage } from "../lib/helpers";
import { OverviewPage } from "../pages/overview_page";
import {
  ProductRegistrationPage,
  ExtensionHaRegistrationPage,
  CustomRegistrationPage,
  ExtensionPhubRegistrationPage,
} from "../pages/registration_page";
import assert from "node:assert/strict";

import { TrustRegistrationCertificatePage } from "../pages/trust_registration_certificate_page";
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
  });

  if (url?.startsWith("https")) {
    it("should handle HTTPS certificate trust for custom registration server", async function () {
      const trustRegistration = new TrustRegistrationCertificatePage(page);
      assert.deepEqual(
        await getTextContent(trustRegistration.titleText()),
        "Registration certificate",
      );
      assert.deepEqual(
        await getTextContent(trustRegistration.questionText()),
        "Trying to import a self signed certificate. Do you want to trust it and register the product?",
      );
      assert.deepEqual(
        await getTextContent(trustRegistration.issuerText()),
        "RMT Certificate Authority",
      );
      assert.deepEqual(await getTextContent(trustRegistration.urlText(url)), url);
      await trustRegistration.trustCertificate();
    });
  }

  it("should display product has been registered", async function () {
    await new OverviewPage(page).waitVisible(60000);
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
  it("should show warning alert for invalid registration code, registration server and null registration code", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const customRegistration = new CustomRegistrationPage(page);
    const invalid_regcode = "123XX432";
    let originalCustomServer: string | null = null;
    const logDir = "/run/agama/scripts";

    await sidebar.goToRegistration();
    const isCustomServer = (await page.$("#url")) !== null;
    if (isCustomServer) {
      originalCustomServer = await page.$eval('input[type="text"][id="url"]', (el) => el.value);
      await customRegistration.selectProvideRegistrationCode();
    }
    await customRegistration.fillCode(invalid_regcode);
    await customRegistration.register();
    assert.deepEqual(
      await getTextContent(customRegistration.connectionToRegistrationServerFailedText()),
      "Warning alert:Connection to registration server failed: Unknown Registration Code.",
    );

    const invalidUrls = ["http://scc.example.net", "https://scc.example.net"];
    for (const invalidUrl of invalidUrls) {
      await customRegistration.selectCustomRegistrationServer();
      await customRegistration.fillServerUrl(invalidUrl);
      await customRegistration.register();

      assert.match(
        await getTextContent(customRegistration.connectionToRegistrationServerFailedText()),
        /Connection to registration server failed: dial tcp: lookup .+ on .+: no such host \(network error\)/,
      );
    }

    console.log("--->we are here");
    if (originalCustomServer) {
      await customRegistration.fillServerUrl(originalCustomServer);
      await customRegistration.selectProvideRegistrationCode();
    } else {
      await customRegistration.selectSUSERegistrationServer();
      console.log("1111 before customRegistration.fillCode");
      dumpPage(logDir, "111_before");
      await customRegistration.fillCode("");
      console.log("222 after customRegistration.fillCode");
      dumpPage(logDir, "22_after");
    }
    console.log("before click register");
    await customRegistration.register();
    dumpPage(logDir, "333_after_register");

    if (originalCustomServer) {
      assert.deepEqual(
        await getTextContent(customRegistration.connectionToRegistrationServerFailedText()),
        "Warning alert:Connection to registration server failed: Please provide Registration Code.",
      );
    } else {
      console.log("We are at last here");
      assert.deepEqual(
        await getTextContent(customRegistration.checkTheFollowingBeforeContinuingText()),
        "Warning alert:Check the following before continuing Enter a registration code",
      );
    }
  });
}

export function registrationHaWarningAlert() {
  it("should should show registration warining for invalid HA registration code", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const extensionRegistration = new ExtensionHaRegistrationPage(page);
    const invalidHARegistrationCode = "12345ABCDX";

    await sidebar.goToRegistration();
    await extensionRegistration.fillCode(invalidHARegistrationCode);
    await extensionRegistration.register();
    assert.deepEqual(
      await getTextContent(extensionRegistration.connectionToRegistrationServerFailedText()),
      `Warning alert:Connection to registration server failed: No subscription with registration code '${invalidHARegistrationCode}' found`,
    );
  });
}
