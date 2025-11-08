import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import zlib from "zlib";
import waitOn from "wait-on";

import * as puppeteer from "puppeteer-core";
// see https://nodejs.org/docs/latest-v20.x/api/test.html
import { it as testIt, before, after } from "node:test";

import { ScreenshotReporter } from "./screenshot_reporter";

import { DumpReporter } from "./dump_reporter";

export let page: puppeteer.Page;
let browser: puppeteer.Browser;
let url: string;

// directory for storing the dumped data after a failure
const dir = "log";

interface BrowserSettings {
  product: puppeteer.Product;
  executablePath: string;
}

// helper function for configuring the browser
function browserSettings(name: string): BrowserSettings {
  switch (name.toLowerCase()) {
    case "firefox":
      return {
        product: "firefox",
        executablePath: "/usr/bin/firefox",
      };
    case "chrome":
      return {
        product: "chrome",
        executablePath: "/usr/bin/google-chrome-stable",
      };
    case "chromium":
      return {
        product: "chrome",
        executablePath: "/usr/bin/chromium",
      };
    default:
      throw new Error(`Unsupported browser type: ${name}`);
  }
}

async function startBrowser(
  headless: boolean,
  slowMo: number,
  agamaBrowser: string,
  agamaServer: string
) {
  url = agamaServer;
  browser = await puppeteer.launch({
    // "webDriverBiDi" does not work with old FireFox, comment it out if needed
    protocol: "webDriverBiDi",
    headless,
    ignoreHTTPSErrors: true,
    timeout: 30000,
    slowMo,
    defaultViewport: {
      width: 1280,
      height: 800,
    },
    ...browserSettings(agamaBrowser),
  });

  page = await browser.newPage();
  page.setDefaultTimeout(20000);
  await page.goto(agamaServer, {
    timeout: 60000,
    waitUntil: "domcontentloaded",
  });
  return { page, browser };
}

async function finishBrowser() {
  if (page) await page.close();
  if (browser) await browser.close();
}

let failed = false;

let continueOnError = false;

export function setContinueOnError(enabled: boolean) {
  continueOnError = enabled;
}

// helper function, dump the index.css file so the HTML dump can properly displayed
export async function dumpCSS(): Promise<string> {
  const cssData = [];
  const downloader = url.startsWith("https://") ? https : http;
  return new Promise((resolve, reject) => {
    downloader
      .get(
        url + "/index.css",
        {
          // ignore HTTPS errors (self-signed certificate)
          rejectUnauthorized: false,
          // use gzip compression
          headers: { "Accept-Encoding": "gzip" },
        },
        (res) => {
          res.on("data", (chunk) => {
            cssData.push(Buffer.from(chunk, "binary"));
          });
          res.on("end", () => {
            // merge all chunks
            const data = Buffer.concat(cssData);
            if (res.headers["content-encoding"] === "gzip") {
              zlib.gunzip(data, (err, unpacked) => {
                if (err) {
                  console.error("Cannot decompress index.css: ", err.cause);
                  reject(err.cause);
                } else {
                  resolve(unpacked.toString());
                }
              });
            } else {
              resolve(data.toString());
            }
          });
        }
      )
      .on("error", (e) => {
        console.error("Cannot download index.css: ", e);
        reject(e);
      });
  });
}

// dump the current page displayed in puppeteer
export async function dumpPage(label: string): Promise<{ html: string, screenshot: string }> {
  // base file name for the dumps
  const name = path.join(dir, label.replace(/[^a-zA-Z0-9]/g, "_"));
  const screenshot = await page.screenshot({ path: name + ".png", encoding: "base64" });
  const html = await page.content();
  fs.writeFileSync(name + ".html", html);
  return { html, screenshot: screenshot as string };
}

export function test_init(options) {
  let reporter: ScreenshotReporter | DumpReporter;

  before(async function () {
    ({ page } = await startBrowser(
      !options.headed,
      options.delay,
      options.browser,
      options.url
    ));
    if (options.screenshotReport) {
      const testPath = process.argv[1];
      const testName = path.basename(testPath, ".ts");
      reporter = new ScreenshotReporter(page, testName);
      reporter.start();
    } else if (options.dumpReport) {
      const testPath = process.argv[1];
      const testName = path.basename(testPath, ".ts");
      reporter = new DumpReporter(page, testName);
      (reporter as DumpReporter).start(dumpPage, dumpCSS);
    }
  });

  after(async function () {
    if (reporter) {
      reporter.stop();
      await reporter.wait();
      reporter.generateReport();
    }
    await finishBrowser();
  });
}

// define it() as a wrapper which dumps the page on a failure
export async function it(label: string, test: () => Promise<void>, timeout?: number) {
  testIt(
    label,
    // abort when the test takes more than one minute
    { timeout: timeout || 60000 },
    async (t) => {
      try {
        // do not run any test after first failure
        if (failed) t.skip();
        else await test();
      } catch (error) {
        // remember the failure for the next tests
        if (!continueOnError) failed = true;
        if (page) {
          // dump the current page
          if (!fs.existsSync(dir)) fs.mkdirSync(dir);
          // dump the page and the CSS in parallel
          await Promise.allSettled([dumpPage(label), dumpCSS()]);
        }
        throw new Error("Test failed!", { cause: error });
      }
    }
  );
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getTextContent(locator): Promise<string> {
  return locator.map((element) => element.textContent).wait();
}

// eslint-disable-next-line
export type GConstructor<T = {}> = new (...args: any[]) => T;

export async function waitOnFile(filePath: string): Promise<void> {
  const opts = {
    resources: [filePath],
    interval: 100,
    timeout: 20000,
    window: 1000,
  };

  try {
    await waitOn(opts);
  } catch (error) {
    throw new Error("waitOnFile failed!", { cause: error });
  }
};
