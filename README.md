# WebPerf tools

## Installation

1. Clone this repository
1. Run `npm install`

## `web-vitals-graphs`

Get last 12 months Web Vitals graphs as images for a device form factor.

> **Note**
> This would not be possible without **Treo**'s awesome free [Site Speed](https://treo.sh/sitespeed) reports, beautiful graphs built with Google's [Chrome UX Report](https://developer.chrome.com/docs/crux/) data.

### Usage

Run `./web-vitals-graphs.js --help` to get informations about the options

```bash
Usage: web-vitals-graphs.js graphs <domain> [device]

Commands:
  web-vitals-graphs.js graphs <domain>      Get last 12 months Web Vitals graphs
  [device]                                  as images for a device form factor

Options:
  --version  Show version number                                       [boolean]
  --domain   Domain                                                   [required]
  --device   Form factor        [choices: "phone", "desktop"] [default: "phone"]
  --help     Show help                                                 [boolean]
```

Example:
`./web-vitals-graphs.js --domain www.clever-age.com --device desktop`
