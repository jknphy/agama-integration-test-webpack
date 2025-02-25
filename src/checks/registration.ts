import { it, sleep, page } from "../lib/helpers";
import { OverviewPage } from "../pages/overview_page";
import { RegistrationEnterCodePage } from "../pages/registration_enter_code_page";
import { SidebarWithRegistrationPage } from "../pages/sidebar_page";

export function enterRegistration(code: string) {
  it("should allow setting registration", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const registration = new RegistrationEnterCodePage(page);

    await sidebar.goToRegistration();
    await registration.fillCode(code);
    await registration.register();
  });

  it("should not display option to register in Overview", async function () {
    await new OverviewPage(page).waitWarningAlertToDisappear();
  });
}

export function enterRegistrationWithoutAlert(code: string) {
  it("should allow setting registration", async function () {
    const sidebar = new SidebarWithRegistrationPage(page);
    const registration = new RegistrationEnterCodePage(page);

    await sidebar.goToRegistration();
    await registration.fillCode(code);
    await registration.register();
    // puppeteer goes too fast and screen is unresponsive after submit, a small delay helps
    await sleep(5000);
  });
}
