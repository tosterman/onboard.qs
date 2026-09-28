import test from 'node:test';
import assert from 'node:assert/strict';
import { BASIC_LESSONS, createBasicSteps } from '../src/tour/qlik-basics.js';

test('all seven basics produce independent editable native steps in checklist order', () => {
    const ids = BASIC_LESSONS.map((item) => item.id);
    const steps = createBasicSteps(ids, { filterObjectId: 'filter1', exportObjectId: 'chart1' });
    assert.equal(steps.length, 7);
    assert.equal(steps[0].targetObjectId, 'filter1');
    assert.equal(steps.at(-1).targetObjectId, 'chart1');
    assert.ok(steps.every((step) => step.disableInteraction === false && step.popoverDescription));
    steps[0].popoverTitle = 'Custom title';
    assert.notEqual(
        createBasicSteps(['filter'], { filterObjectId: 'filter1' })[0].popoverTitle,
        'Custom title'
    );
});

test('only checked lessons are added, duplicates are ignored, and context is validated', () => {
    assert.equal(createBasicSteps(['bookmark-create', 'bookmark-create']).length, 1);
    assert.deepEqual(createBasicSteps([]), []);
    assert.throws(() => createBasicSteps(['export']), /chart/i);
    assert.throws(() => createBasicSteps(['filter']), /filter/i);
    assert.throws(() => createBasicSteps(['unknown']), /unknown/i);
});

test('templates preserve upstream schema through JSON roundtrip and make no verification claim', () => {
    const steps = createBasicSteps([
        'clear-one',
        'clear-all',
        'undo',
        'bookmark-create',
        'bookmark-apply',
    ]);
    assert.deepEqual(JSON.parse(JSON.stringify(steps)), steps);
    assert.ok(steps.every((s) => s.selectorType === 'css' && !s.completion));
    assert.match(steps[0].popoverDescription, /selection/i);
    assert.match(steps[1].popoverDescription, /locked/i);
});
