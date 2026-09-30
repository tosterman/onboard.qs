import { BASIC_LESSONS, createBasicSteps } from '../tour/qlik-basics.js';

/**
 * Open the checklist using the existing editor's button styling.
 *
 * @param {HTMLElement} parent - Editor overlay.
 * @param {Array<{id: string, title: string, type: string}>} objects - Current-sheet objects.
 * @param {(steps: object[]) => void} onAdd - Receives generated steps after validation.
 *
 * @returns {void}
 */
export function openBasicsDialog(parent, objects, onAdd) {
    if (parent.querySelector('.oqs-basics-overlay')) return;
    const previousFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'oqs-basics-overlay';
    overlay.innerHTML = `<section class="oqs-basics-dialog" role="dialog" aria-modal="true" aria-labelledby="oqs-basics-title">
        <h2 id="oqs-basics-title">Include Qlik basics</h2>
        <p>Choose the skills to add to this tour. Each becomes a normal step you can edit, reorder or remove.</p>
        <div class="oqs-basics-options"></div>
        <p class="oqs-basics-note">Guided practice: users try the action and choose Next. These steps do not enforce completion. Toolbar targets are prepared for Qlik Cloud; preview them in your app.</p>
        <p class="oqs-basics-error" role="alert" hidden></p>
        <div class="oqs-basics-actions"><button type="button" class="onboard-qs-btn onboard-qs-btn--secondary" data-action="cancel">Cancel</button><button type="button" class="onboard-qs-btn onboard-qs-btn--primary" data-action="add" disabled>Add selected steps</button></div>
    </section>`;
    const options = overlay.querySelector('.oqs-basics-options');
    const picks = new Map();
    const add = overlay.querySelector('[data-action="add"]');
    for (const lesson of BASIC_LESSONS) {
        const row = document.createElement('div');
        row.className = 'oqs-basics-option';
        const label = document.createElement('label');
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.value = lesson.id;
        label.append(check, document.createTextNode(lesson.label));
        row.append(label);
        if (lesson.object) {
            const targetLabel = document.createElement('label');
            targetLabel.className = 'oqs-basics-target';
            targetLabel.hidden = true;
            targetLabel.append(
                document.createTextNode(
                    lesson.id === 'filter' ? 'Filter or chart to practice with' : 'Chart to export'
                )
            );
            const select = document.createElement('select');
            select.append(new Option('Choose a sheet object…', ''));
            for (const object of objects)
                select.append(new Option(object.title || object.id, object.id));
            targetLabel.append(select);
            row.append(targetLabel);
            picks.set(lesson.object, select);
            check.addEventListener('change', () => {
                targetLabel.hidden = !check.checked;
            });
        }
        check.addEventListener('change', () => {
            add.disabled = !options.querySelector('input:checked');
        });
        options.append(row);
    }
    /** Remove the checklist and restore the launching control's focus. */
    const close = () => {
        overlay.remove();
        previousFocus?.focus();
    };
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
    add.addEventListener('click', () => {
        const error = overlay.querySelector('.oqs-basics-error');
        try {
            const ids = [...options.querySelectorAll('input:checked')].map((check) => check.value);
            const targets = Object.fromEntries(
                [...picks].map(([key, select]) => [key, select.value])
            );
            const steps = createBasicSteps(ids, targets);
            onAdd(steps);
            close();
        } catch (err) {
            error.textContent = err.message;
            error.hidden = false;
        }
    });
    overlay.addEventListener('keydown', (event) => {
        event.stopPropagation();
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
        if (event.key === 'Tab') {
            const controls = [...overlay.querySelectorAll('input,select,button')].filter(
                (control) => !control.disabled && !control.closest('[hidden]')
            );
            const first = controls[0],
                last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    parent.append(overlay);
    options.querySelector('input').focus();
}
