# Desktop Practice — Win11React educational fork

A free, open-source browser desktop for learning everyday computer tasks. This
is an independent fork of [Win11React](https://github.com/blueedgetechno/win11React),
created by **blueedgetechno**, with work by **andrewstech and the Win11React team**.
Their desktop, window management, and application code are the foundation of this
fork. The upstream repository and its full contributor history remain linked
through GitHub's fork relationship.

## What this fork changes

- Uses the local account **owner** at startup, in Settings, and in sample file paths.
- Removes the upstream Buy Me a Coffee app, pinned entry, forced desktop shortcut,
  README badge, and GitHub funding configuration. No replacement fundraiser is added.
- Implements a Recycle Bin for sample files, folders, and desktop shortcuts.
  Select an item in File Explorer and choose **Delete**, or press Delete. Open the
  bin from the desktop or Explorer sidebar to restore it, delete it permanently,
  or empty the bin. Permanent deletion requires confirmation. Folders retain
  their contents; name collisions never overwrite existing files. If an original
  folder is gone, its restored files go to Documents.
- Replaces bundled raster images, vendor logos, wallpaper, avatars, setup artwork,
  copied inline icons, and undocumented font files with original geometric SVG
  artwork. The desktop remains a recognizable practice environment; icons are
  intentionally independent designs rather than exact Microsoft artwork.
- Keeps visible upstream credit in the desktop's **About & credits** button,
  About dialog, this README, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Run locally

Use Node.js 22 or newer:

```sh
npm ci
npm start
```

`npm test` checks file and Recycle Bin behavior. `npm run build` regenerates
original artwork and builds the static app into `build/`. `npm run preview`
serves that build locally. The GitHub Actions workflow runs tests and builds
without publishing a website.

## Practice session limits

All files are simulated. No real files or devices are accessed. The virtual
filesystem and Recycle Bin reset when the page reloads. Appearance and desktop
shortcut preferences use local browser storage. Other inherited applications
remain demos; this first change does not implement the full educational lesson
engine or a complete operating system. Some inherited applications can open
external services when deliberately launched.

The learning website lives in a separate repository. This public fork can be
modified, downloaded, and built on its own; it does not publish private website
source or handouts. No public deployment has been configured for this fork yet.

## License and credit

The upstream [CC0-1.0 license](LICENSE) is retained. Original additions and the new
artwork are also dedicated under CC0-1.0. Separately licensed dependencies retain
their own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the served
`licenses/` directory. Please continue crediting the original Win11React authors.

Windows and Microsoft are trademarks of Microsoft. This educational simulation
is not affiliated with or endorsed by Microsoft and is not Windows or a cloud PC.
