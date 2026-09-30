import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { openBasicsDialog } from '../src/ui/qlik-basics-dialog.js';

const dom = new JSDOM('<button id="trigger">Basics</button><div id="host"></div>', {
    url: 'https://test.qlikcloud.com/sense/app/test/sheet/test',
});
Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    Option: dom.window.Option,
    HTMLElement: dom.window.HTMLElement,
});
const objects = [
    { id: 'year', title: 'Year <filter>' },
    { id: 'cost', title: 'Server cost' },
];
const host = document.querySelector('#host');

test('checklist validates chart choice, appends selected steps once and restores focus', () => {
    document.querySelector('#trigger').focus();
    let received;
    openBasicsDialog(host, objects, (steps) => {
        received = steps;
    });
    openBasicsDialog(host, objects, () => assert.fail('duplicate dialog'));
    assert.equal(host.querySelectorAll('[role="dialog"]').length, 1);
    const add = host.querySelector('[data-action="add"]');
    assert.equal(add.disabled, true);
    host.querySelector('input[value="export"]').click();
    add.click();
    assert.match(host.querySelector('[role="alert"]').textContent, /chart/i);
    assert.equal(received, undefined);
    host.querySelectorAll('select')[1].value = 'cost';
    add.click();
    assert.equal(received.length, 1);
    assert.equal(received[0].targetObjectId, 'cost');
    assert.equal(host.childElementCount, 0);
    assert.equal(document.activeElement.id, 'trigger');
});

test('Cancel and Escape do not mutate the tour; object titles are rendered as text', () => {
    openBasicsDialog(host, objects, () => assert.fail('cancel must not add'));
    assert.equal(host.querySelector('option[value="year"]').textContent, 'Year <filter>');
    assert.equal(host.querySelector('filter'), null);
    host.querySelector('input').dispatchEvent(
        new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    assert.equal(host.childElementCount, 0);
});

test('real upstream editor saves and reopens generated steps without changing existing steps', async () => {
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
    const { openTourEditor } = await import(
        'data:text/javascript;base64,' + Buffer.from(output.outputFiles[0].text).toString('base64')
    );
    let props = {
        tours: [
            {
                tourId: 'intro',
                tourName: 'Intro',
                steps: [
                    {
                        selectorType: 'none',
                        popoverTitle: 'Keep me',
                        popoverDescription: 'Original content',
                    },
                ],
            },
        ],
    };
    const model = {
        getProperties: async () => structuredClone(props),
        setProperties: async (value) => {
            props = structuredClone(value);
        },
    };
    await openTourEditor({ layout: structuredClone(props), model, sheetObjects: objects });
    document.querySelector('.onboard-qs-editor__basics').click();
    document.querySelector('input[value="bookmark-create"]').click();
    document.querySelector('input[value="clear-all"]').click();
    document.querySelector('[data-action="add"]').click();
    document.querySelector('.onboard-qs-editor__save').click();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(props.tours[0].steps.length, 3);
    assert.equal(props.tours[0].steps[0].popoverTitle, 'Keep me');
    assert.equal(document.querySelector('#onboard-qs-editor-overlay'), null);
    await openTourEditor({ layout: structuredClone(props), model, sheetObjects: objects });
    assert.equal(document.querySelectorAll('.onboard-qs-editor__step-item').length, 3);
    document.querySelector('.onboard-qs-editor__cancel').click();
    dom.window.close();
});
