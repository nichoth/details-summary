# `details-summary`
![tests](https://github.com/nichoth/details-summary/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/details-summary?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@nichoth/details-summary?cache-control=no-cache)](https://packagephobia.com/result?p=@nichoth/details-summary)
[![GZip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/details-summary)](https://bundlephobia.com/package/@substrate-system/details-summary)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


Details + summary HTML elements with better style.

[See a live demo](https://nichoth.github.io/details-summary/)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Example](#example)
- [API](#api)
  * [ESM](#esm)
  * [Common JS](#common-js)
  * [Attributes](#attributes)
  * [Events](#events)
- [CSS](#css)
  * [Import CSS](#import-css)
  * [Customize CSS via some variables](#customize-css-via-some-variables)
- [Use](#use)
  * [JS](#js)
  * [HTML](#html)
  * [pre-built](#pre-built)

<!-- tocstop -->

</details>

## Install

```sh
npm i -S @substrate-system/details-summary
```

## Example

Tag name, `details-summary` is exposed as `.TAG` on the class.

```ts
import { DetailsSummary } from '@substrate-system/details-summary'
import '@substrate-system/details-summary/css'

document.body += `
  <${DetailsSummary.TAG}></${DetailsSummary.TAG}>
`
```

```html
<details-summary duration="400">
    <details>
        <summary>What is this?</summary>
        <div class="details-content">
            This is a details/summary web component with smooth animation.
        </div>
    </details>
</details-summary>
```

## API

This exposes ESM and common JS via
[package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@substrate-system/details-summary'
```

### Common JS
```js
require('@substrate-system/details-summary')
```

### Attributes

#### `default-open`

Boolean attribute. When present, the `<details>` element will be open by
default on viewports wider than 990px.

```html
<details-summary default-open>
    <details>
        <summary>Open on desktop</summary>
        <div class="details-content">This starts open on desktop.</div>
    </details>
</details-summary>
```

#### `duration`

Number (milliseconds). Controls how long the open/close animation takes.
Defaults to `300`.

```html
<details-summary duration="500">
    <details>
        <summary>Slow animation</summary>
        <div class="details-content">This takes 500ms to open or close.</div>
    </details>
</details-summary>
```

### Events

This element wraps the native `<details>` element. The native [`toggle` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event) fires on the inner `<details>` element whenever it opens or closes.

```js
const el = document.querySelector('details-summary')
el.querySelector('details').addEventListener('toggle', ev => {
    console.log('open?', ev.target.open)
})
```

## CSS

### Import CSS

```js
import '@substrate-system/details-summary/css'
```

Or minified:
```js
import '@substrate-system/details-summary/min/css'
```

### Customize CSS via CSS variables

| Variable | Default | Description |
|---|---|---|
| `--details-summary-border-color` | `0, 0, 0` | RGB value for the bottom border color |
| `--details-summary-padding` | `1rem` | Padding for the summary and content |
| `--details-summary-font-weight` | `600` | Font weight of the summary text |
| `--details-summary-font-size` | `16px` | Font size of the summary text |
| `--details-summary-transition-speed` | `0.3s` | Speed of the icon rotation and content fade transitions |
| `--details-summary-content-color` | `#444` | Text color of the details content |

```css
details-summary {
    --details-summary-border-color: 100, 100, 200;
    --details-summary-padding: 0.75rem;
    --details-summary-transition-speed: 0.5s;
}
```

## Use

This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@substrate-system/details-summary'
```

### HTML
```html
<div>
    <details-summary></details-summary>
</div>
```

### pre-built

This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/details-summary/dist/index.min.js ./public/details-summary.min.js
cp ./node_modules/@substrate-system/details-summary/dist/style.min.css ./public/details-summary.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./details-summary.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./details-summary.min.js"></script>
</body>
```
