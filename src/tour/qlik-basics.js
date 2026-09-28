/** Ready-to-edit lessons. Selectors use Qlik Cloud's observed stable control attributes. */
export const BASIC_LESSONS = [
    {
        id: 'filter',
        label: 'Filter your data',
        object: 'filterObjectId',
        title: 'Focus on the data you need',
        description:
            'Select a value in the highlighted filter or chart. Confirm the selection with the green checkmark if Qlik shows one. Notice how the other charts update.\n\nTry it, then choose Next.',
    },
    {
        id: 'clear-one',
        label: 'Clear one filter',
        selector: '[data-tid="current-selections-item"], .qv-selections-pager',
        title: 'Remove one filter',
        description:
            'First make a selection if none is active. In the selections bar, use the × beside one selected field to remove that filter. Other selected fields stay selected. Locked selections must be unlocked first.\n\nTry it, then choose Next.',
    },
    {
        id: 'clear-all',
        label: 'Clear all filters',
        selector:
            '[data-tid="current-selections-clear"], [data-testid="current-selections-clear"], [tid="clear-selections"]',
        title: 'Start again with clear selections',
        description:
            'Use Clear all selections to remove your current unlocked filters. This affects the whole app, not just this chart. Locked selections remain. If the button is disabled, there may be nothing to clear.\n\nTry it, then choose Next.',
    },
    {
        id: 'undo',
        label: 'Undo a selection',
        selector:
            '[data-testid="current-selections-back"], [data-tid="current-selections-back"], [tid="back-selections"]',
        title: 'Go back one selection',
        description:
            'Use Step back to undo the last change to your selections. It restores the previous selection state; it does not undo chart edits. If disabled, make a selection first.\n\nTry it, then choose Next.',
    },
    {
        id: 'bookmark-create',
        label: 'Create a bookmark',
        selector: '[data-tid="assets-button-bookmarks"], [tid="bookmarks"]',
        title: 'Save a useful view',
        description:
            'Open Bookmarks, choose Create new bookmark, and give it a meaningful title. Save the current selections so you can return to this analysis later. The available options depend on your Qlik permissions.\n\nTry it, then choose Next. This step does not automatically verify bookmark creation.',
    },
    {
        id: 'bookmark-apply',
        label: 'Apply a bookmark',
        selector: '[data-tid="assets-button-bookmarks"], [tid="bookmarks"]',
        title: 'Return to a saved analysis',
        description:
            'Open Bookmarks and select a saved bookmark. Check the selections bar to see which filters were restored. A bookmark can also change the sheet if its creator saved a sheet location. Create a bookmark first if none is available.\n\nTry it, then choose Next.',
    },
    {
        id: 'export',
        label: 'Export chart data',
        object: 'exportObjectId',
        title: 'Take the result with you',
        description:
            'Open the highlighted chart’s menu (or right-click it), choose Download, then Data, and complete the download. The exported rows reflect your current selections and access. Some charts or permissions do not support data export.\n\nTry it, then choose Next. This step does not automatically verify the downloaded file.',
    },
];

/**
 * Generate independent steps using the original Onboard.qs schema.
 *
 * @param {string[]} ids - Checked lesson identifiers.
 * @param {object} [targets] - Author-selected sheet objects.
 * @param {string} [targets.filterObjectId] - Filter or chart for selection practice.
 * @param {string} [targets.exportObjectId] - Chart for export practice.
 *
 * @returns {object[]} Editable steps in checklist order.
 */
export function createBasicSteps(ids, targets = {}) {
    if (ids.some((id) => !BASIC_LESSONS.some((lesson) => lesson.id === id))) {
        throw new Error('Unknown Qlik basics lesson.');
    }
    return BASIC_LESSONS.filter((lesson) => ids.includes(lesson.id)).map((lesson) => {
        if (lesson.object && !targets[lesson.object]) {
            throw new Error(
                lesson.id === 'filter'
                    ? 'Choose a filter or chart for selection practice.'
                    : 'Choose a chart to export.'
            );
        }
        return {
            qlikBasic: lesson.id,
            selectorType: lesson.object ? 'object' : 'css',
            targetObjectId: lesson.object ? targets[lesson.object] : '',
            customCssSelector: lesson.selector || '',
            popoverTitle: lesson.title,
            popoverDescription: lesson.description,
            popoverSide: 'bottom',
            popoverAlign: 'center',
            disableInteraction: false,
            dialogSize: 'dynamic',
        };
    });
}
