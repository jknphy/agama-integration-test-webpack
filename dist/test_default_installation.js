#! /usr/bin/env node
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/checks/configuration_started.ts":
/*!*********************************************!*\
  !*** ./src/checks/configuration_started.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ensureProductConfigurationStarted = ensureProductConfigurationStarted;
const helpers_1 = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.ts");
const configuring_product_page_1 = __webpack_require__(/*! ../pages/configuring_product_page */ "./src/pages/configuring_product_page.ts");
const overview_page_1 = __webpack_require__(/*! ../pages/overview_page */ "./src/pages/overview_page.ts");
function ensureProductConfigurationStarted() {
    (0, helpers_1.it)("should start configuring the product", async function () {
        await new configuring_product_page_1.ConfiguringProductPage(helpers_1.page).wait();
    });
    (0, helpers_1.it)("should display Overview", async function () {
        await new overview_page_1.OverviewPage(helpers_1.page).waitVisible(40000);
    });
}


/***/ }),

/***/ "./src/checks/login.ts":
/*!*****************************!*\
  !*** ./src/checks/login.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logIn = logIn;
const strict_1 = __importDefault(__webpack_require__(/*! node:assert/strict */ "node:assert/strict"));
const helpers_1 = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.ts");
const login_as_root_page_1 = __webpack_require__(/*! ../pages/login_as_root_page */ "./src/pages/login_as_root_page.ts");
function logIn(password) {
    (0, helpers_1.it)("should have Agama page title", async function () {
        strict_1.default.deepEqual(await helpers_1.page.title(), "Agama");
    });
    (0, helpers_1.it)("should allow logging in", async function () {
        const loginAsRoot = new login_as_root_page_1.LoginAsRootPage(helpers_1.page);
        await loginAsRoot.fillPassword(password);
        await loginAsRoot.logIn();
    });
}


/***/ }),

/***/ "./src/checks/product_selection.ts":
/*!*****************************************!*\
  !*** ./src/checks/product_selection.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.productSelection = productSelection;
exports.productSelectionWithLicense = productSelectionWithLicense;
const helpers_1 = __webpack_require__(/*! ../lib/helpers */ "./src/lib/helpers.ts");
const product_selection_page_1 = __webpack_require__(/*! ../pages/product_selection_page */ "./src/pages/product_selection_page.ts");
function productSelection(productId) {
    (0, helpers_1.it)(`should allow to select product ${productId}`, async function () {
        const productSelectionPage = new product_selection_page_1.ProductSelectionPage(helpers_1.page);
        await productSelectionPage.choose(productId);
        await productSelectionPage.select();
    });
}
function productSelectionWithLicense(productId) {
    (0, helpers_1.it)(`should allow to choose product ${productId}`, async function () {
        await new product_selection_page_1.ProductSelectionWithRegistrationPage(helpers_1.page).choose(productId);
    });
    (0, helpers_1.it)(`should allow to review its license`, async function () {
        const productSelectionWithRegistrationPage = new product_selection_page_1.ProductSelectionWithRegistrationPage(helpers_1.page);
        await productSelectionWithRegistrationPage.openLicense();
        await productSelectionWithRegistrationPage.verifyLicense();
        await productSelectionWithRegistrationPage.closeLicense();
    });
    (0, helpers_1.it)(`should allow to accept its license`, async function () {
        await new product_selection_page_1.ProductSelectionWithRegistrationPage(helpers_1.page).acceptProductLicense();
    });
    (0, helpers_1.it)(`should allow to select product`, async function () {
        await new product_selection_page_1.ProductSelectionWithRegistrationPage(helpers_1.page).select();
    });
}


/***/ }),

/***/ "./src/lib/cmdline.ts":
/*!****************************!*\
  !*** ./src/lib/cmdline.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commaSeparatedList = commaSeparatedList;
exports.parse = parse;
const commander_1 = __webpack_require__(/*! commander */ "./node_modules/commander/index.js");
const commander = __importStar(__webpack_require__(/*! commander */ "./node_modules/commander/index.js"));
const helpers_1 = __webpack_require__(/*! ./helpers */ "./src/lib/helpers.ts");
// parse command line argument as an integer
function getInt(value) {
    // parse the value as a decimal number (base 10)
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new commander.InvalidArgumentError("Enter a valid number.");
    }
    return parsed;
}
function commaSeparatedList(value) {
    return value.split(',');
}
/**
 * Parse command line options. When an invalid command line option is used the script aborts.
 * @param callback callback for adding custom command line options
 * @returns [commander.OptionValues] parsed command line
 * @see https://github.com/tj/commander.js
 */
function parse(callback) {
    // define the command line arguments and parse them
    const prg = commander_1.program
        .description("Run a simple Agama integration test")
        .option("-u, --url <url>", "Agama server URL", "http://localhost")
        .option("-p, --password <password>", "Agama login password", "linux")
        .option("-a, --agama-version <version>", "Agama package version")
        .option("-v, --product-version <version>", "Product version")
        .addOption(new commander_1.Option("-b, --browser <browser>", "Browser used for running the test")
        .choices(["firefox", "chrome", "chromium"])
        .default("firefox"))
        .option("-r, --root-password <password>", "Target root login password", "linux")
        .option("-h, --headed", "Run the browser in headed mode with UI (the default is headless mode)")
        .addOption(new commander_1.Option("-d, --delay <miliseconds>", "Delay between the browser actions, useful in headed mode")
        .argParser(getInt)
        .default(0))
        .option("-c, --continue", "Continue the test after a failure (the default is abort on error)", false)
        .option("--screenshot-report", "Enable screenshot reporter", false)
        .option("--dump-report", "Enable dump reporter", false);
    if (callback)
        callback(prg);
    prg.parse(process.argv);
    (0, helpers_1.setContinueOnError)(commander_1.program.opts().continue);
    // parse options from the command line
    return commander_1.program.opts();
}


/***/ }),

/***/ "./src/lib/dump_reporter.ts":
/*!**********************************!*\
  !*** ./src/lib/dump_reporter.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DumpReporter = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const filmstripScript = `
  document.addEventListener('DOMContentLoaded', () => {
    const filmstripNav = document.getElementById('filmstrip-nav');
    const iframes = document.querySelectorAll('iframe');
    const iframeContainers = Array.from(iframes).map(iframe => iframe.parentElement);

    if (!filmstripNav || iframes.length === 0) return;

    // 1. Setup placeholders and assign IDs
    iframes.forEach((iframe, index) => {
      const iframeId = \`iframe-\${index}\`;
      iframe.id = iframeId;
      const container = iframe.parentElement;
      container.id = \`container-\${iframeId}\`;
      container.classList.add('iframe-container'); // Add class for scroll margin

      const placeholder = document.createElement('div');
      placeholder.className = 'filmstrip-item';
      placeholder.dataset.targetId = iframeId;
      
      const placeholderText = document.createElement('span');
      placeholderText.className = 'filmstrip-placeholder-text';
      placeholderText.textContent = \`Frame \${index + 1}\`;
      placeholder.appendChild(placeholderText);

      filmstripNav.appendChild(placeholder);
    });

    // 2. Lazy generation of thumbnails with retries
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          const iframeId = placeholder.dataset.targetId;
          const iframe = document.getElementById(iframeId);
          
          const captureWithRetries = (maxRetries = 10, attempt = 1) => {
            const internalDoc = iframe.contentDocument;
            // Condition: Check if the root element inside the iframe has children
            if (internalDoc && internalDoc.getElementById('root')?.childElementCount > 0) {
              html2canvas(internalDoc.body, {
                width: internalDoc.body.scrollWidth,
                height: internalDoc.body.scrollHeight,
                useCORS: true,
                scale: 0.5
              }).then(canvas => {
                const img = new Image();
                img.src = canvas.toDataURL('image/jpeg', 0.8);
                img.onload = () => {
                  placeholder.innerHTML = ''; // Clear placeholder text
                  placeholder.appendChild(img);
                  observer.unobserve(placeholder); // Unobserve only on success
                };
              }).catch(err => {
                console.error(\`html2canvas error on attempt \${attempt} for \${iframeId}:\`, err);
                if (attempt < maxRetries) {
                  setTimeout(() => captureWithRetries(maxRetries, attempt + 1), 2000);
                } else {
                  const errorText = placeholder.querySelector('.filmstrip-placeholder-text');
                  if(errorText) errorText.textContent = 'Capture Failed';
                }
              });
            } else if (attempt < maxRetries) {
              // If content not ready, wait and retry
              setTimeout(() => captureWithRetries(maxRetries, attempt + 1), 2000);
            } else {
              console.error(\`Capture failed for \${iframeId}: Content not ready after \${maxRetries} attempts.\`);
              const errorText = placeholder.querySelector('.filmstrip-placeholder-text');
              if(errorText) errorText.textContent = 'Capture Failed';
            }
          };

          // If iframe is already loaded (e.g. from cache), start capture. Otherwise, wait for load event.
          if (iframe.contentDocument.readyState === 'complete') {
            captureWithRetries();
          } else {
            iframe.addEventListener('load', () => captureWithRetries(), { once: true });
          }
        }
      });
    }, { root: filmstripNav, rootMargin: '0px 0px 500px 0px', threshold: 1.0 });

    document.querySelectorAll('.filmstrip-item').forEach(item => {
      lazyObserver.observe(item);
    });

    // 3. Click-to-scroll functionality
    filmstripNav.addEventListener('click', (e) => {
      const item = e.target.closest('.filmstrip-item');
      if (item && item.dataset.targetId) {
        const containerId = \`container-\${item.dataset.targetId}\`;
        const targetContainer = document.getElementById(containerId);
        if (targetContainer) {
          targetContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    // 4. Active state highlighting
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const iframeId = entry.target.querySelector('iframe')?.id;
        if (!iframeId) return;

        const filmstripItem = filmstripNav.querySelector(\`.filmstrip-item[data-target-id="\${iframeId}"]\`);
        if (entry.isIntersecting) {
          document.querySelectorAll('.filmstrip-item.active').forEach(active => active.classList.remove('active'));
          filmstripItem.classList.add('active');
          filmstripItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }, { threshold: 0.5, rootMargin: "0px 0px -120px 0px" }); 

    iframeContainers.forEach(container => {
      activeObserver.observe(container);
    });
  });
`;
class DumpReporter {
    page;
    testName;
    dumpDir;
    dumps = [];
    reportPath;
    cssContent = "";
    running = false;
    loop = null;
    constructor(page, testName, dumpDir = "dumps") {
        this.page = page;
        this.testName = testName;
        this.dumpDir = dumpDir;
        this.reportPath = path.join(this.dumpDir, `${this.testName}.html`);
    }
    start(dumpPage, dumpCSS, interval = 500) {
        this.dumps = [];
        fs.mkdirSync(this.dumpDir, { recursive: true });
        this.running = true;
        this.loop = (async () => {
            this.cssContent = await dumpCSS();
            while (this.running) {
                const label = `${this.testName}_${Date.now()}`;
                const { html, screenshot } = await dumpPage(label);
                this.dumps.push({
                    html,
                    screenshot,
                });
                await new Promise((resolve) => setTimeout(resolve, interval));
            }
        })();
    }
    stop() {
        this.running = false;
    }
    async wait() {
        if (this.loop) {
            await this.loop;
        }
    }
    generateReport() {
        const body = this.dumps
            .map((dump) => {
            const styledHtml = dump.html
                .replace(/<link rel="stylesheet" href="index.css">/, "")
                .replace(/<script type="module" src=".\/index.js"><\/script>/, "")
                .replace("</head>", `<style>${this.cssContent}</style></head>`);
            return `
      <div style="width: 100%; height: 600px; overflow: hidden; border: 1px solid black; margin-bottom: 10px;">
        <iframe srcdoc="${styledHtml.replace(/"/g, "&quot;")}" width="100%" height="100%" style="border: none;"></iframe>
      </div>
    `;
        })
            .join("");
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Report: ${this.testName}</title>
        </head>
        <style>
          body {
            padding-left: 180px; /* Provide space for the fixed filmstrip */
          }
          #filmstrip-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 180px;
            height: 100%;
            background-color: #222;
            padding: 5px 10px;
            white-space: normal;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 2px 0 5px rgba(0,0,0,0.5);
          }
          .filmstrip-item {
            display: block;
            width: 160px; /* Fixed width for placeholders */
            height: 90px; /* 16:9 aspect ratio */
            margin: 10px 0;
            cursor: pointer;
            border: 2px solid #555;
            border-radius: 4px;
            transition: border-color 0.3s, transform 0.3s;
            background-color: #333;
            overflow: hidden;
            position: relative;
          }
          .filmstrip-item:hover {
            border-color: #007bff;
            transform: scale(1.05);
          }
          .filmstrip-item.active {
            border-color: #28a745;
            box-shadow: 0 0 10px #28a745;
          }
          .filmstrip-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .filmstrip-placeholder-text {
            color: #888;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: sans-serif;
            font-size: 12px;
          }
          .iframe-container {
            scroll-margin-left: 180px; /* Match body padding-left to prevent overlap */
          }
        </style>
        <body>
          <div id="filmstrip-nav"></div>
          <h1>Test Report: ${this.testName}</h1>
          ${body}
          <script src="../node_modules/html2canvas/dist/html2canvas.min.js"></script>
          <script>${filmstripScript}</script>
        </body>
      </html>
    `;
        fs.writeFileSync(this.reportPath, html);
        console.log(`Report generated at ${this.reportPath}`);
    }
}
exports.DumpReporter = DumpReporter;


/***/ }),

/***/ "./src/lib/helpers.ts":
/*!****************************!*\
  !*** ./src/lib/helpers.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.page = void 0;
exports.setContinueOnError = setContinueOnError;
exports.dumpCSS = dumpCSS;
exports.dumpPage = dumpPage;
exports.test_init = test_init;
exports.it = it;
exports.sleep = sleep;
exports.getTextContent = getTextContent;
exports.waitOnFile = waitOnFile;
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
const https_1 = __importDefault(__webpack_require__(/*! https */ "https"));
const zlib_1 = __importDefault(__webpack_require__(/*! zlib */ "zlib"));
const wait_on_1 = __importDefault(__webpack_require__(/*! wait-on */ "./node_modules/wait-on/lib/wait-on.js"));
const puppeteer = __importStar(__webpack_require__(/*! puppeteer-core */ "./node_modules/puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js"));
// see https://nodejs.org/docs/latest-v20.x/api/test.html
const node_test_1 = __webpack_require__(/*! node:test */ "node:test");
const screenshot_reporter_1 = __webpack_require__(/*! ./screenshot_reporter */ "./src/lib/screenshot_reporter.ts");
const dump_reporter_1 = __webpack_require__(/*! ./dump_reporter */ "./src/lib/dump_reporter.ts");
let browser;
let url;
// directory for storing the dumped data after a failure
const dir = "log";
// helper function for configuring the browser
function browserSettings(name) {
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
async function startBrowser(headless, slowMo, agamaBrowser, agamaServer) {
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
    exports.page = await browser.newPage();
    exports.page.setDefaultTimeout(20000);
    await exports.page.goto(agamaServer, {
        timeout: 60000,
        waitUntil: "domcontentloaded",
    });
    return { page: exports.page, browser };
}
async function finishBrowser() {
    if (exports.page)
        await exports.page.close();
    if (browser)
        await browser.close();
}
let failed = false;
let continueOnError = false;
function setContinueOnError(enabled) {
    continueOnError = enabled;
}
// helper function, dump the index.css file so the HTML dump can properly displayed
async function dumpCSS() {
    const cssData = [];
    const downloader = url.startsWith("https://") ? https_1.default : http_1.default;
    return new Promise((resolve, reject) => {
        downloader
            .get(url + "/index.css", {
            // ignore HTTPS errors (self-signed certificate)
            rejectUnauthorized: false,
            // use gzip compression
            headers: { "Accept-Encoding": "gzip" },
        }, (res) => {
            res.on("data", (chunk) => {
                cssData.push(Buffer.from(chunk, "binary"));
            });
            res.on("end", () => {
                // merge all chunks
                const data = Buffer.concat(cssData);
                if (res.headers["content-encoding"] === "gzip") {
                    zlib_1.default.gunzip(data, (err, unpacked) => {
                        if (err) {
                            console.error("Cannot decompress index.css: ", err.cause);
                            reject(err.cause);
                        }
                        else {
                            resolve(unpacked.toString());
                        }
                    });
                }
                else {
                    resolve(data.toString());
                }
            });
        })
            .on("error", (e) => {
            console.error("Cannot download index.css: ", e);
            reject(e);
        });
    });
}
// dump the current page displayed in puppeteer
async function dumpPage(label) {
    // base file name for the dumps
    const name = path_1.default.join(dir, label.replace(/[^a-zA-Z0-9]/g, "_"));
    const screenshot = await exports.page.screenshot({ path: name + ".png", encoding: "base64" });
    const html = await exports.page.content();
    fs_1.default.writeFileSync(name + ".html", html);
    return { html, screenshot: screenshot };
}
function test_init(options) {
    let reporter;
    (0, node_test_1.before)(async function () {
        ({ page: exports.page } = await startBrowser(!options.headed, options.delay, options.browser, options.url));
        if (options.screenshotReport) {
            const testPath = process.argv[1];
            const testName = path_1.default.basename(testPath, ".ts");
            reporter = new screenshot_reporter_1.ScreenshotReporter(exports.page, testName);
            reporter.start();
        }
        else if (options.dumpReport) {
            const testPath = process.argv[1];
            const testName = path_1.default.basename(testPath, ".ts");
            reporter = new dump_reporter_1.DumpReporter(exports.page, testName);
            reporter.start(dumpPage, dumpCSS);
        }
    });
    (0, node_test_1.after)(async function () {
        if (reporter) {
            reporter.stop();
            await reporter.wait();
            reporter.generateReport();
        }
        await finishBrowser();
    });
}
// define it() as a wrapper which dumps the page on a failure
async function it(label, test, timeout) {
    (0, node_test_1.it)(label, 
    // abort when the test takes more than one minute
    { timeout: timeout || 60000 }, async (t) => {
        try {
            // do not run any test after first failure
            if (failed)
                t.skip();
            else
                await test();
        }
        catch (error) {
            // remember the failure for the next tests
            if (!continueOnError)
                failed = true;
            if (exports.page) {
                // dump the current page
                if (!fs_1.default.existsSync(dir))
                    fs_1.default.mkdirSync(dir);
                // dump the page and the CSS in parallel
                await Promise.allSettled([dumpPage(label), dumpCSS()]);
            }
            throw new Error("Test failed!", { cause: error });
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getTextContent(locator) {
    return locator.map((element) => element.textContent).wait();
}
async function waitOnFile(filePath) {
    const opts = {
        resources: [filePath],
        interval: 100,
        timeout: 20000,
        window: 1000,
    };
    try {
        await (0, wait_on_1.default)(opts);
    }
    catch (error) {
        throw new Error("waitOnFile failed!", { cause: error });
    }
}
;


/***/ }),

/***/ "./src/lib/screenshot_reporter.ts":
/*!****************************************!*\
  !*** ./src/lib/screenshot_reporter.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScreenshotReporter = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
class ScreenshotReporter {
    page;
    testName;
    screenshotDir;
    screenshots = [];
    reportPath;
    running = false;
    loop = null;
    constructor(page, testName, screenshotDir = "screenshots") {
        this.page = page;
        this.testName = testName;
        this.screenshotDir = screenshotDir;
        this.reportPath = path.join(this.screenshotDir, `${this.testName}.html`);
    }
    start(interval = 500) {
        this.screenshots = [];
        fs.mkdirSync(this.screenshotDir, { recursive: true });
        this.running = true;
        this.loop = (async () => {
            while (this.running) {
                const screenshotPath = path.join(this.screenshotDir, `${this.testName}_${Date.now()}.png`);
                await this.page.screenshot({ path: screenshotPath });
                this.screenshots.push(screenshotPath);
                await new Promise((resolve) => setTimeout(resolve, interval));
            }
        })();
    }
    stop() {
        this.running = false;
    }
    async wait() {
        if (this.loop) {
            await this.loop;
        }
    }
    generateReport() {
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
            .map((screenshot) => `
      <div class="screenshot">
        <img src="${path.basename(screenshot)}" alt="${screenshot}" />
        <p>${path.basename(screenshot)}</p>
      </div>
    `)
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
exports.ScreenshotReporter = ScreenshotReporter;


/***/ }),

/***/ "./src/pages/configuring_product_page.ts":
/*!***********************************************!*\
  !*** ./src/pages/configuring_product_page.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfiguringProductPage = void 0;
class ConfiguringProductPage {
    page;
    configuringTheProductText = () => this.page.locator("::-p-text(Configuring the product)");
    constructor(page) {
        this.page = page;
    }
    async wait() {
        await this.configuringTheProductText().wait();
    }
}
exports.ConfiguringProductPage = ConfiguringProductPage;


/***/ }),

/***/ "./src/pages/login_as_root_page.ts":
/*!*****************************************!*\
  !*** ./src/pages/login_as_root_page.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginAsRootPage = void 0;
class LoginAsRootPage {
    page;
    passwordInput = () => this.page.locator("input#password");
    logInButton = () => this.page.locator("button[type='submit']");
    constructor(page) {
        this.page = page;
    }
    async fillPassword(password) {
        await this.passwordInput().fill(password);
    }
    async logIn() {
        await this.logInButton().click();
    }
}
exports.LoginAsRootPage = LoginAsRootPage;


/***/ }),

/***/ "./src/pages/overview_page.ts":
/*!************************************!*\
  !*** ./src/pages/overview_page.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OverviewPage = void 0;
class OverviewPage {
    page;
    installButton = () => this.page.locator("button::-p-text(Install)");
    overviewHeading = () => this.page.locator('::-p-aria([name="Overview"][role="heading"])');
    constructor(page) {
        this.page = page;
    }
    async waitVisible(timeout) {
        await this.overviewHeading().setTimeout(timeout).wait();
    }
    async install() {
        await this.installButton().click();
    }
}
exports.OverviewPage = OverviewPage;


/***/ }),

/***/ "./src/pages/product_selection_page.ts":
/*!*********************************************!*\
  !*** ./src/pages/product_selection_page.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductSelectionWithRegistrationPage = exports.ProductSelectionPage = void 0;
class ProductSelectionPage {
    page;
    productText = (name) => this.page.locator(`::-p-text(${name})`);
    productId = (id) => this.page.locator("input#" + id.replaceAll(".", "\\."));
    selectButton = () => this.page.locator("button[form='productSelectionForm']");
    constructor(page) {
        this.page = page;
    }
    async choose(id) {
        (await this.productId(id).waitHandle()).scrollIntoView();
        await this.productId(id).click();
    }
    async select() {
        await this.selectButton().click();
    }
    async selectByName(name) {
        await this.choose(name);
        await this.selectButton().click();
    }
}
exports.ProductSelectionPage = ProductSelectionPage;
function LicenseAcceptable(Base) {
    return class extends Base {
        licenseAcceptanceCheckbox = () => this.page.locator("::-p-text(I have read and)");
        licenseOpenButton = () => this.page.locator("::-p-text(license)");
        licenseCloseButton = () => this.page.locator("::-p-text(Close)");
        licenseText = () => this.page.locator("::-p-text(End User License Agreement)");
        async acceptLicense() {
            await this.licenseAcceptanceCheckbox().click();
        }
        async openLicense() {
            await this.licenseOpenButton().click();
        }
        async verifyLicense() {
            await this.licenseText().wait();
        }
        async closeLicense() {
            await this.licenseCloseButton().click();
        }
        async acceptProductLicense() {
            await this.acceptLicense();
        }
    };
}
class ProductSelectionWithRegistrationPage extends LicenseAcceptable(ProductSelectionPage) {
}
exports.ProductSelectionWithRegistrationPage = ProductSelectionWithRegistrationPage;


/***/ }),

/***/ "./src/test_default_installation.ts":
/*!******************************************!*\
  !*** ./src/test_default_installation.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const cmdline_1 = __webpack_require__(/*! ./lib/cmdline */ "./src/lib/cmdline.ts");
const helpers_1 = __webpack_require__(/*! ./lib/helpers */ "./src/lib/helpers.ts");
const commander_1 = __webpack_require__(/*! commander */ "./node_modules/commander/index.js");
// import { createFirstUser } from "./checks/first_user";
// import { editRootUser } from "./checks/root_authentication";
const configuration_started_1 = __webpack_require__(/*! ./checks/configuration_started */ "./src/checks/configuration_started.ts");
// import { enterProductRegistration, enterExtensionRegistrationHA } from "./checks/registration";
const login_1 = __webpack_require__(/*! ./checks/login */ "./src/checks/login.ts");
// import { performInstallation, finishInstallation } from "./checks/installation";
const product_selection_1 = __webpack_require__(/*! ./checks/product_selection */ "./src/checks/product_selection.ts");
// import { prepareZfcpStorage } from "./checks/storage_zfcp";
// import { selectPatterns } from "./checks/software_selection";
// parse options from the command line
const options = (0, cmdline_1.parse)((cmd) => cmd
    .option("--product-id <id>", "Product id to select a product to install", "none")
    .option("--accept-license", "Accept license for a product with license (the default is a product without license)")
    .option("--registration-code <code>", "Registration code")
    .option("--registration-code-ha <code>", "Registration code for Extension High Availability")
    .option("--patterns <pattern>...", "comma-separated list of patterns", cmdline_1.commaSeparatedList)
    .option("--install", "Proceed to install the system (the default is not to install it)")
    .option("--use-custom-registration-server", "Enable custom registration server")
    .option("--provide-registration-code", "provide registration code for customer registration")
    .addOption(new commander_1.Option("--prepare-advanced-storage <storage-type>", "Prepare advance storage for installation").choices(["dasd", "zfcp"])));
(0, helpers_1.test_init)(options);
(0, login_1.logIn)(options.password);
if (options.productId !== "none")
    if (options.acceptLicense)
        (0, product_selection_1.productSelectionWithLicense)(options.productId);
    else
        (0, product_selection_1.productSelection)(options.productId);
(0, configuration_started_1.ensureProductConfigurationStarted)();
// if (options.registrationCode)
//   enterProductRegistration({
//     use_custom: options.useCustomRegistrationServer,
//     code: options.registrationCode,
//     provide_code: options.provideRegistrationCode,
//   });
// if (options.registrationCodeHa) enterExtensionRegistrationHA(options.registrationCodeHa);
// if (options.patterns) selectPatterns(options.patterns);
// createFirstUser(options.password);
// editRootUser(options.rootPassword);
// if (options.prepareAdvancedStorage === "zfcp") prepareZfcpStorage();
// if (options.install) {
//   performInstallation();
//   finishInstallation();
// }


/***/ }),

/***/ "./node_modules/yargs-parser/build sync recursive":
/*!***********************************************!*\
  !*** ./node_modules/yargs-parser/build/ sync ***!
  \***********************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/yargs-parser/build sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/yargs/build sync recursive":
/*!****************************************!*\
  !*** ./node_modules/yargs/build/ sync ***!
  \****************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/yargs/build sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "node:assert/strict":
/*!*************************************!*\
  !*** external "node:assert/strict" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:assert/strict");

/***/ }),

/***/ "node:child_process":
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:test":
/*!****************************!*\
  !*** external "node:test" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:test");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__(__webpack_require__.s = "./src/test_default_installation.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"test_default_installation": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("vendor");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=test_default_installation.js.map