#!/usr/bin/env node

const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const vitals = { "Time to First Byte": "ttfb", "First Contentful Paint": "fcp", "Largest Contentful Paint": "lcp", "Cumulative Layout Shift": "cls", "Interaction to Next Paint": "inp" };

const dateString = new Date().toISOString().slice(0, 10);

const argv = require("yargs/yargs")(process.argv.slice(2))
  .detectLocale(false)
  .usage("Usage: $0 graphs [domain] [device] [country] [reverse]")
  .command(
    "graphs [domain] [device] [country] [reverse]",
    "Get last 12 months Web Vitals graphs as images for a device form factor"
  )
  .describe({
    domain: "Domain",
    device: "Form factor",
    country: "Country",
    reverse: "Reverse domain name parts (for better file system sorting)",
  })
  .boolean("reverse")
  .choices("device", ["phone", "desktop"])
  .default({ device: "phone", reverse: false })
  .demandOption(["domain"])
  .help().argv;

(async () => {
  const DOMAIN = argv.domain;
  const DEVICE = argv.device;
  const COUNTRY = argv.country;
  const REVERSE = argv.reverse;

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

    console.log(
      `Get Treo graphs for ${DOMAIN}, ${
        COUNTRY ? `in "${COUNTRY}"` : "globaly"
      }, on ${DEVICE}`
    );

    const TREO_URL = `https://treo.sh/sitespeed/${DOMAIN}?siteFlags=dist&formFactor=${DEVICE}${
      COUNTRY ? `&countryCode=${COUNTRY}` : ""
    }`;

    await page.goto(TREO_URL, { waitUntil: "domcontentloaded", timeout: 0 });

    let directory = path.join(
      ".",
      "graphs",
      REVERSE ? DOMAIN.split(".").reverse().join(".") : DOMAIN,
      COUNTRY ? COUNTRY : "global",
      dateString,
      DEVICE
    );
    await fs.mkdir(directory, { recursive: true });

    const graphs = await page.$$(`#metrics + div > div`);

    await Promise.all(
      graphs.map(async (graph) => {
        try {
          const fullname = await graph.$eval("h3", (el) => el.textContent.trim());
          const vital = vitals[fullname];
          const file = path.join(directory, `${vital}.png`);

          // console.log(`Processing graph: ${fullname}`);
          if (!fsSync.existsSync(file)) {
            await page.waitForTimeout(1000);
            await graph.screenshot({ path: file, type: "png" });
          }
        } catch (e) {
          console.log(`Error capturing graph: ${e}`);
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
