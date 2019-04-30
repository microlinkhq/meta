import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    @import url('https://fonts.googleapis.com/css?family=Lato');
    @import url('https://rsms.me/inter/inter.css');

    :root {
        --zoom: 80%;
        --line-space: 100px;
        --line-color: #e1e8ef;
        --line-height-ratio: 1;
        --text-color: #313b53;
      }

    body {
        background: ${background};
        background-size: 60px 60px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: monospace;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    main {
        display: flex;
        zoom: var(--zoom);
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        padding-right: var(--line-space);
    }

    .heading-wrapper {
        display: flex;
        padding-left: var(--line-space);
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .line {
        background: var(--line-color);
        width: 8px;
        margin: calc(var(--line-space) * var(--line-height-ratio)) 0;
        padding: 0;
    }

    .heading {
        font-family: 'Lato', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        color: var(--text-color);
        text-transform: uppercase;
        word-spacing: 30px;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <main>
        <div class="logo-wrapper">
            ${images.map((img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i])).join('')}
        </div>
        <div class="line"></div>
        <div class="heading-wrapper">
        <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = 'auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
