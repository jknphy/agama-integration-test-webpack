import { Page } from "puppeteer-core";
import * as fs from "fs";
import * as path from "path";

export class ScreenshotReporter {
  private screenshots: string[] = [];
  private reportPath: string;
  private running: boolean = false;
  private loop: Promise<void> | null = null;

  constructor(
    private page: Page,
    private testName: string,
    private screenshotDir: string = "screenshots"
  ) {
    this.reportPath = path.join(this.screenshotDir, `${this.testName}.html`);
  }

  public start(interval: number = 500) {
    this.screenshots = [];
    fs.mkdirSync(this.screenshotDir, { recursive: true });
    this.running = true;

    this.loop = (async () => {
      while (this.running) {
        const screenshotPath = path.join(
          this.screenshotDir,
          `${this.testName}_${Date.now()}.png`
        );
        await this.page.screenshot({ path: screenshotPath });
        this.screenshots.push(screenshotPath);
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    })();
  }

  public stop() {
    this.running = false;
  }

  public async wait() {
    if (this.loop) {
      await this.loop;
    }
  }

  public generateReport() {
    const css = `
      body { font-family: sans-serif; }
      h1 { text-align: center; }
      .film-strip {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        padding: 10px;
      }
      .screenshot {
        border: 1px solid #ccc;
        padding: 5px;
        text-align: center;
      }
      .screenshot img {
        max-width: 100%;
        height: auto;
      }
    `;

    const body = this.screenshots
      .map(
        (screenshot) => `
      <div class="screenshot">
        <img src="${path.basename(screenshot)}" alt="${screenshot}" />
        <p>${path.basename(screenshot)}</p>
      </div>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Report: ${this.testName}</title>
          <style>${css}</style>
        </head>
        <body>
          <h1>Test Report: ${this.testName}</h1>
          <div class="film-strip">
            ${body}
          </div>
        </body>
      </html>
    `;

    fs.writeFileSync(this.reportPath, html);
    console.log(`Report generated at ${this.reportPath}`);
  }
}
