import { Page } from "puppeteer-core";
import * as fs from "fs";
import * as path from "path";

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

export class DumpReporter {
  private dumps: { html: string; screenshot: string }[] = [];
  private reportPath: string;
  private cssContent: string = "";
  private running: boolean = false;
  private loop: Promise<void> | null = null;

  constructor(
    private page: Page,
    private testName: string,
    private dumpDir: string = "dumps"
  ) {
    this.reportPath = path.join(this.dumpDir, `${this.testName}.html`);
  }

  public start(
    dumpPage: (label: string) => Promise<{html: string, screenshot: string}>,
    dumpCSS: () => Promise<string>,
    interval: number = 500
  ) {
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

  public stop() {
    this.running = false;
  }

  public async wait() {
    if (this.loop) {
      await this.loop;
    }
  }

  public generateReport() {
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