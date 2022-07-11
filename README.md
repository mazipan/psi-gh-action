# 🐯 psi-gh-action

Github Action to generating static web performance report for JAMStack using PageSpeedInsight

![Version](https://img.shields.io/github/v/release/mazipan/psi-gh-action?label=version) ![.github/workflows/example.yml](https://github.com/mazipan/psi-gh-action/workflows/.github/workflows/example.yml/badge.svg?branch=master)

![Screenshot](screenshots/action-log.png)

## Motivations

I want to create an open web performance report for my personal blog, I want my reader can access my web performance report as easy as they read my articles. That's why I build this Github Actions, so whenever I need to show web performance report in my open source project then I just need to using this Actions.

## Inputs

| Input       | Description                                     | Required                   | Default  |
| ----------- | ----------------------------------------------- | -------------------------- | -------- |
| `api_key`   | PageSpeedInsight API key                        | ✅                         |          |
| `urls`      | List of URL(s) to be analyzed                   | ✅                         |          |
| `devices`   | Device(s) used for test                         | ❌                         | `mobile` |
| `runs`      | Number of runs to do per URL                    | ❌                         | `1`      |
| `push_back` | Push JSON report to the main branch             | ❌                         | `false`  |
| `override`  | Will always make a request to PSI for every job | ❌                         | `false`  |
| `token`     | Github token                                    | ✅ (when `push_back=true`) |          |
| `branch`    | Main branch to store report files               | ❌                         | `master` |
| `max`       | Number of reports should be kept on repository  | ❌                         | `10`     |

## Example usage

```yaml
- name: psi-gh-action
  uses: mazipan/psi-gh-action@1.7.0
  with:
    api_key: ${{ secrets.PSI_API_KEY }}
    urls: |
      https://mazipan.space/
      https://mazipan.space/about/
      https://mazipan.space/talks/
    devices: |
      mobile
      desktop
    runs: 1
    max: 10
    branch: master
    push_back: true
    override: false
    token: ${{ secrets.GITHUB_TOKEN }}
```

## Implementation notes

- Since this Actions will push report file to your main branch directly, so I recommend to not use `on push` trigger for this Actions. Please use a cron scheduler instead
- This Actions will need `actions/checkout@v2` to enable `push back` feature.

## Using with `checkout@v2` and cron scheduler

```yml
name: Generate PSI report
on:
  schedule:
    - cron: '30 2 * * 6'

jobs:
  run_psi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: psi-gh-action
        uses: mazipan/psi-gh-action@1.7.0
        with:
          api_key: ${{ secrets.PSI_API_KEY }}
          urls: |
            https://mazipan.space/
          devices: |
            mobile
            desktop
          runs: 1
          max: 10
          branch: master
          push_back: true
          override: false
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Report file generated

This Github Actions will generate these following files:

- File `psi-reports/LAST_UPDATED.txt`
- File `psi-reports/available-reports.json`

```js
{
  "latest": "report-YYYY-MM-DD.json",
  "all": ["report-YYYY-MM-DD.json"],
}
```

- File `psi-reports/report-YYYY-MM-DD.json`

```js
{
  "timestamp": "2021-02-05T16:12:02.119Z",
  "reports": [
    {
      "url": "https://mazipan.space/",
      "device": "mobile", // Device type for running Lighthouse
      "perf": 0.78,       // Performance score by PSI
      "fid": 16,          // First Input Delay based on Chrome UX field data
      "lcp": 2775,        // Largest Contentful Paint
      "cls": 0,           // Cummulative Layout Shift
      "fcp": 2100,        // First Contentful Paint
      "tbt": 591,         // Total Blocking Time
      "tti": 5656.5,      // Time to Interactive
      "si": 2100,         // Speed Index
      "req": 42,          // Total count of all resources requested by the page
      "size": 394708      // Total size of all resources requested by the page
    }
  ]
}
```

## Example UI for Next.js project

- See commit [c865772](https://github.com/mazipan/mazipan.space/commit/c86577204951760750b56f9c30660d0189cdad07) for implementation detail. See [mazipan.space/speed](https://mazipan.space/speed) for the UI result

## Awesome users

See the complete list on [AWESOME-USERS.md](AWESOME-USERS.md)

## Additional Resources

### How to add new secret in Github Actions

Go to: https://github.com/{YOUR_USERNAME}/{YOUR_REPO}/settings/secrets/actions

Read more: https://docs.github.com/en/actions/reference/encrypted-secrets

### Create Pull Request after suceess

Instead of push directly to the branch, sometimes you just want to create pull request to main branch then you can merge it manually.
To solve this case, I recommend to use [`peter-evans/create-pull-request`](https://github.com/peter-evans/create-pull-request)

### How to create new API Key for PSI

https://developers.google.com/speed/docs/insights/v5/get-started

You might need to set a restriction to `None` for your API KEY in the [credential page](https://console.developers.google.com/apis/credentials)

![setup restriction](screenshots/key-restriction.png)

## Abbreviation

| Word  | Description              | Link                                            |
| ----- | ------------------------ | ----------------------------------------------- |
| `FID` | First Input Delay        | https://web.dev/fid/                            |
| `LCP` | Largest Contentful Paint | https://web.dev/lcp/                            |
| `CLS` | Cumulative Layout Shift  | https://web.dev/cls/                            |
| `FCP` | First Contentful Paint   | https://web.dev/first-contentful-paint/         |
| `FCI` | First CPU Idle           | https://web.dev/first-cpu-idle/                 |
| `TBT` | Total Blocking Time      | https://web.dev/lighthouse-total-blocking-time/ |
| `TTI` | Time to Interactive      | https://web.dev/tti/                            |
| `SI`  | Speed Index              | https://web.dev/speed-index/                    |

---

© 2021 - Code by [@mazipan](https://mazipan.space/)
