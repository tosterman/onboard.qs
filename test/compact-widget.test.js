import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
const output = await build({
    entryPoints: ['src/ui/widget-renderer.js'],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    define: {
        __BUILD_TYPE__: '"production"',
        __PACKAGE_VERSION__: '"test"',
        __BUILD_DATE__: '"test"',
    },
});
const dom = new JSDOM('', { url: 'https://test.qlikcloud.com' });
let resized;
let disconnected = false;
Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    ResizeObserver: class {
        constructor(fn) {
            resized = fn;
        }
        observe() {}
        disconnect() {
            disconnected = true;
        }
    },
});
const { renderWidget, renderEditPlaceholder } = await import(
    'data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64')
);
for (const edit of [false, true]) {
    test(`${edit ? 'editor' : 'launcher'} adapts to a narrow Qlik cell and releases host styling`, () => {
        document.body.innerHTML =
            '<div class="qv-gridcell"><article class="qv-object"><div class="qv-inner-object"><div id="content"></div></div></article><div class="qv-object-nav"></div></div>';
        const host = document.querySelector('article');
        let width = 24;
        host.getBoundingClientRect = () => ({ width, height: 40 });
        const el = document.getElementById('content');
        const layout = {
            tours: [{ tourId: 'test', tourName: 'Intro', steps: [] }],
            widget: { buttonText: 'Help " & learn' },
        };
        if (edit) renderEditPlaceholder(el, layout);
        else renderWidget(el, layout, {});
        assert.equal(
            document.querySelector('.qv-gridcell').classList.contains('oqs-compact-widget'),
            true
        );
        const button = el.querySelector('button');
        assert.equal(button.getAttribute('aria-label'), edit ? 'Edit Tours' : 'Help " & learn');
        assert.ok(button.querySelector('svg[aria-hidden="true"]'));
        width = 300;
        resized();
        assert.equal(
            document.querySelector('.qv-gridcell').classList.contains('oqs-compact-widget'),
            false
        );
        width = 24;
        resized();
        disconnected = false;
        el._onboardResizeCleanup();
        assert.equal(disconnected, true);
        assert.equal(
            document.querySelector('.qv-gridcell').classList.contains('oqs-compact-widget'),
            false
        );
        el._onboardCleanup?.();
    });
}
