import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';

const output = await build({
    entryPoints: ['src/ui/tour-editor.js'],
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
const dom = new JSDOM('', { url: 'https://test.qlikcloud.com/sense/app/test/sheet/test' });
Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Option: dom.window.Option,
});
const { openTourEditor } = await import(
    'data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64')
);
const tick = () => new Promise((resolve) => setImmediate(resolve));

for (const failure of ['read', 'write']) {
    test(`failed ${failure} preserves draft and imported theme, blocks duplicate saves, and retries`, async (t) => {
        t.mock.method(console, 'error', () => {});
        const layout = {
            tours: [{ tourId: 'intro', tourName: 'Intro', steps: [] }],
            _importedTheme: { preset: 'dark' },
        };
        let fail = false;
        let release;
        let writes = 0;
        let reads = 0;
        let saved;
        const model = {
            getProperties: async () => {
                reads++;
                if (fail && failure === 'read') throw new Error('offline');
                return { tours: [], theme: {} };
            },
            setProperties: async (value) => {
                writes++;
                await new Promise((resolve) => {
                    release = resolve;
                });
                if (fail) throw new Error('denied');
                saved = structuredClone(value);
            },
        };
        await openTourEditor({ layout, model, sheetObjects: [] });
        const name = document.querySelector('.onboard-qs-editor__tour-name-input');
        name.value = 'Unsaved work';
        name.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
        const save = document.querySelector('.onboard-qs-editor__save');
        fail = true;
        save.click();
        save.click();
        assert.equal(save.disabled, true);
        assert.equal(save.textContent, 'Saving…');
        document
            .querySelector('#onboard-qs-editor-overlay')
            .dispatchEvent(
                new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
            );
        assert.ok(document.querySelector('#onboard-qs-editor-overlay'));
        await tick();
        if (failure === 'write') {
            release();
            await tick();
            assert.equal(writes, 1);
        }
        assert.equal(reads, 2);
        assert.ok(document.querySelector('#onboard-qs-editor-overlay'));
        assert.match(document.querySelector('[role="alert"]').textContent, /edits are still here/);
        assert.equal(save.disabled, false);
        assert.equal(document.querySelector('.onboard-qs-editor__export').disabled, false);
        assert.equal(name.value, 'Unsaved work');
        assert.deepEqual(layout._importedTheme, { preset: 'dark' });
        fail = false;
        save.click();
        await tick();
        release();
        await tick();
        assert.equal(saved.tours[0].tourName, 'Unsaved work');
        assert.equal(saved.theme.preset, 'dark');
        assert.equal(layout._importedTheme, undefined);
        assert.equal(document.querySelector('#onboard-qs-editor-overlay'), null);
    });
}
