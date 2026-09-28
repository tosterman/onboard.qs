import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { createBasicSteps } from '../src/tour/qlik-basics.js';

test('practice interaction styling applies only to generated basics, not ordinary tour steps', async () => {
    const dom = new JSDOM('<body></body>', { url: 'https://test.qlikcloud.com' });
    Object.assign(globalThis, { window: dom.window, document: dom.window.document });
    const output = await build({
        entryPoints: ['src/tour/tour-runner.js'],
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
    const { buildDriverSteps } = await import(
        'data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64')
    );
    const basic = createBasicSteps(['bookmark-create'])[0];
    const ordinary = { selectorType: 'none', popoverTitle: 'Original' };
    const steps = buildDriverSteps({ steps: [basic, ordinary] }, 'cloud');
    assert.match(steps[0].popover.popoverClass, /oqs-basic-practice/);
    assert.doesNotMatch(steps[1].popover.popoverClass, /oqs-basic-practice/);
    dom.window.close();
});
