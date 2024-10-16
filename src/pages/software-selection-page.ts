import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
    private readonly page: Page;
    private readonly gnomeSoftwareText = (software = 'GNOME Desktop Environment (Wayland)') => this.page.locator(`::-p-text('${software}')`);
    private readonly kdeSoftwareText = (software = 'KDE Applications and Plasma Desktop') => this.page.locator(`::-p-text('${software}')`);

    private readonly closeButton = () => this.page.locator("button::-p-text(Close)");

    constructor(page: Page) {
        this.page = page;
    }

    async selectSoftware(software: string) {
        await this.gnomeSoftwareText(software).click();
    }
    async close() {
	await this.closeButton().click();
    }
}
