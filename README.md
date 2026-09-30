# Onboard Tour

Onboard Tour adds guided walkthroughs to Qlik Cloud apps. Developers create tours in a visual editor, and users follow instructions beside the charts and controls they are learning to use.

Use it to introduce an app, teach filtering and bookmarks, or walk users through a business question such as **"Which servers cost the most this year?"**

## Features

- **Visual tour editor:** create and edit steps inside the Qlik app.
- **Qlik basics checklist:** add ready-made lessons for filtering, clearing filters, undo, bookmarks, and exporting data.
- **Flexible targeting:** highlight a sheet object or a specific page element, or display a standalone welcome message.
- **Automatic or manual launch:** start a tour when the sheet opens or let users launch it themselves.
- **Show-once behavior:** remember that a tour has been seen in the current browser profile.
- **Appearance controls:** customize colors, text, placement, progress indicators, and launch buttons.
- **Import and export:** back up tours or transfer them between apps using JSON.

Tours provide guided practice. Users advance with **Next** and **Done**; the extension does not automatically verify that they performed each task.

**[Download the installation ZIP](https://github.com/tosterman/onboard.qs/releases/latest/download/onboard-qs.zip)** | [Release notes](https://github.com/tosterman/onboard.qs/releases)

## Install or Update

You need permission to manage extensions in Qlik Cloud and edit the app where you will create tours.

1. Open [Releases](https://github.com/tosterman/onboard.qs/releases) and expand **Assets** for the version you want. Development releases may be marked **Pre-release**.
2. Download **onboard-qs.zip**. Upload this file intact; do not extract it.
3. In Qlik Cloud **Administration → Extensions**, add the extension. To update an existing installation, edit **onboard-qs**, replace its ZIP, and save.
4. Refresh your app and enter sheet edit mode.
5. Open **Custom objects → Tyler's Custom Extensions** and drag **Onboard Tour** onto the sheet.

**Use the release asset, not GitHub's Code → Download ZIP or Source code (zip).** Those downloads contain development files and are not installable extensions.

The extension is displayed as **Onboard Tour**. Its internal ID and installation filename remain **onboard-qs** so existing app objects continue using the same extension.

## Create a Tour

1. Select the extension in sheet edit mode and click **Edit Tours**.
2. Add a tour and give it a descriptive name.
3. Add a step and choose its target.
4. Enter the title and instructions. Descriptions support Markdown formatting.
5. Repeat for the remaining steps, then click **Save**.
6. Switch to analysis mode and launch the tour to check the instructions, targets, and placement.

Keep each step focused on one action. Use the app's actual field names and explain what the result means.

### Add Qlik Basics

In the tour editor, select a tour and click **Include Qlik basics**. Choose any of these lessons:

| Lesson            | What it introduces                        |
| ----------------- | ----------------------------------------- |
| Filter data       | Make a selection in a chosen sheet object |
| Clear one filter  | Remove an individual selection            |
| Clear all filters | Reset the current selections              |
| Undo a selection  | Return to the previous selection state    |
| Create a bookmark | Save a selection state                    |
| Apply a bookmark  | Return to a saved selection state         |
| Export chart data | Export data from a chosen chart           |

Choose the relevant sheet objects for filtering and export, then click **Add selected steps**. The generated steps remain editable. Adjust their wording for your app and save the tour.

For a server-cost walkthrough, you could ask users to select **2026**, sort the cost table, and save their answer as a bookmark. Add the sorting instructions as a custom step.

### Choose a Target

| Target type             | When to use it                                                                |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Sheet Object**        | Highlight a chart or filter object selected from the dropdown                 |
| **Custom CSS Selector** | Highlight a specific element, such as a button within an object               |
| **Standalone Dialog**   | Show a welcome, explanation, or closing message without highlighting anything |

A CSS selector highlights the element it matches. It does not necessarily highlight the entire Qlik object. Selectors depend on the page structure, so preview them in your app and recheck them after Qlik UI changes.

Use step placement settings to position the instructions around the target. When users need to interact with a target, configure the step to allow interaction.

## Launch and Appearance

Users can launch tours from the in-sheet button. Narrow objects automatically show a compact help icon; in edit mode it opens the tour editor. Hover over the icon for its label. You can also enable **Show toolbar button** to add a **Start Tour** control to the app toolbar. This is built into Onboard Tour and requires no additional extension.

When the toolbar is the preferred entry point, **Hide sheet widget** hides the extension's content in analysis mode. It does not reclaim the object's sheet grid space.

Use the appearance settings to adjust button labels, colors, fonts, alignment, overlay, and popover placement. Preview the result at the sheet size your users will use.

## Auto-start and Remembering Users

Configure these settings for each tour:

| Setting            | Behavior                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Auto-start**     | Launch the tour automatically when the sheet loads                                         |
| **Show only once** | Skip automatic launch after this tour version has been seen in the current browser profile |
| **Tour version**   | Increase the number to make an updated tour eligible for automatic launch again            |

Closing a tour early counts as seen. Users can still launch it manually for a refresher.

Seen state is stored in browser local storage and normally survives closing and reopening the browser. Clearing the site's data, switching browser profiles, or using another device starts fresh. This state is not tied to a Qlik user ID; people sharing a browser profile share it.

## Saving and Backups

Click **Save** to persist editor changes to the Qlik object. Duplicate saves are blocked while a save is in progress. If saving fails, the editor retains the draft and imported theme so you can retry or export a backup.

Unsaved drafts are not guaranteed to survive a browser refresh or closure.

Use **Export** in the tour editor to save selected tours as JSON, optionally including theme and widget settings. Use **Import** to restore or transfer them:

| Import mode          | Behavior                                               |
| -------------------- | ------------------------------------------------------ |
| **Replace Matching** | Replace tours with matching names and append new tours |
| **Replace All**      | Replace the existing tour collection                   |
| **Add to Existing**  | Append imported tours as new entries                   |

Review the imported tours, confirm their target objects in the destination app, and save.

## Validation and Limitations

Qlik basics workflows and extension installation have been verified in a Qlik Cloud test tenant. Client-managed Qlik Sense, mobile, and full keyboard or assistive-technology acceptance have not been validated for this edition.

Compact 1×1 launch and editor controls have been verified in the Qlik Cloud test app. Further hardening is needed for missing targets and competing automatic tours. Preview tours in the destination app before rollout.

## Development

See the [Development Guide](docs/DEVELOPMENT.md) for build instructions and source structure. Release-specific changes are described in [GitHub Releases](https://github.com/tosterman/onboard.qs/releases).

Report problems through [Issues](https://github.com/tosterman/onboard.qs/issues), including the extension version, Qlik environment, and steps to reproduce. Do not include credentials or confidential app data.

## License and Attribution

Maintained by Tyler Osterman. Based on [Onboard.qs](https://github.com/ptarmiganlabs/onboard.qs), originally created by Göran Sander and Ptarmigan Labs.

Distributed under the [MIT license](LICENSE). Original copyright and license notices are retained.
