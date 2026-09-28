import { PACKAGE_VERSION, BUILD_DATE } from '../util/logger';

/**
 * About / Support property panel section.
 *
 * Displays version info, build date, project description, and links to
 * documentation, issue tracker, and Ptarmigan Labs website.
 *
 * @returns {object} Property panel section definition.
 */
export function aboutSection() {
    return {
        type: 'items',
        label: 'About',
        items: {
            versionInfo: {
                component: 'text',
                label: `Onboard.qs v${PACKAGE_VERSION}`,
            },
            buildDate: {
                component: 'text',
                label: `Built ${BUILD_DATE}`,
            },
            description: {
                component: 'text',
                label: 'Guided onboarding for Qlik Cloud, with ready-made lessons for filtering, bookmarks and exporting data. Enhanced edition of Onboard.qs.',
            },
            homepageGit: {
                component: 'link',
                label: 'Documentation & Source Code',
                url: 'https://github.com/tosterman/onboard.qs',
            },
            reportBug: {
                component: 'link',
                label: 'Report a Bug / Request a Feature',
                url: 'https://github.com/tosterman/onboard.qs/issues',
            },
            homepagePlabs: {
                component: 'link',
                label: 'Original Onboard.qs — Ptarmigan Labs',
                url: 'https://github.com/ptarmiganlabs/onboard.qs',
            },
        },
    };
}
