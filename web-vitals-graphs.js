#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const vitals = [
  { vital: "ttfb", selector: "div.isSingle.isCompact:nth-child(1)" },
  { vital: "fcp", selector: "div.isSingle.isCompact:nth-child(2)" },
  { vital: "lcp", selector: "div.isSingle.isCompact:nth-child(3)" },
  { vital: "cls", selector: "div.isSingle.isCompact:nth-child(4)" },
  { vital: "fid", selector: "div.isSingle.isCompact:nth-child(5)" },
  { vital: "inp", selector: "div.isSingle.isCompact:nth-child(6)" },
];

const dateString = new Date().toISOString().slice(0, 10);

const argv = require("yargs/yargs")(process.argv.slice(2))
  .usage("Usage: $0 graphs <domain> [device]")
  .command(
    "graphs <domain> [device]",
    "Get last 12 months Web Vitals graphs as images for a device form factor"
  )
  .describe({
    domain: "Domain",
    device: "Form factor",
  })
  .choices("device", ["phone", "desktop"])
  .default("device", "phone")
  .demandOption(["domain"])
  .help().argv;

(async () => {
  const DOMAIN = argv.domain;
  const DEVICE = argv.device;

  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 2880,
      height: 1800,
      deviceScaleFactor: 2,
    });

    console.log(`Get Treo graphs for ${DOMAIN} on ${DEVICE}`);

    const TREO_URL = `https://treo.sh/sitespeed/${DOMAIN}?formFactor=${DEVICE}&metricsMode=d`;

    await page.goto(TREO_URL, { waitUntil: "networkidle0", timeout: 0 });

    await page.evaluate(() => {
      let style = document.createElement("style");

      style.innerHTML = `
        .isSingle.isCompact {
          padding: 0.2rem !important;
        }
        .isSingle.isCompact :last-child {
          margin: 0.5rem 0;
        }
        `;
      document.head.appendChild(style);
    });

    const directory = path.join("./graphs/", DOMAIN, dateString, DEVICE);
    await fs.mkdir(directory, { recursive: true });

    await Promise.all(
      vitals.map(async (entry) => {
        const { vital, selector } = entry;
        const file = path.join(directory, `${vital}.png`);

        const graph = await page.$(selector);
        if (graph) {
          await graph.screenshot({ path: file, type: "png" });
        }
      })
    );
    await page.close();
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
})();
