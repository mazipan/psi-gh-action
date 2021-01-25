# 🐯 psi-gh-action

Github Action to generate web performance report using PageSpeedInsight

![.github/workflows/example.yml](https://github.com/mazipan/psi-gh-action/workflows/.github/workflows/example.yml/badge.svg?branch=master)

## Inputs

### `api_key`

**Required** PageSpeedInsight API key.
### `urls`

**Required** List of URL(s) to be analyzed.

### `devices`

**Optional** Device(s) used for test. Default is `mobile`.

### `runs`

**Optional** Number of runs to do per URL. Default is `1`.

## Example usage

```yaml
uses: mazipan/psi-gh-action
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
```

## TODOs

- [ ] Generate static file summary report in `data` dir then push back to the source
