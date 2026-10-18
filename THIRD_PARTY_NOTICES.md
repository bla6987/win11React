# Attribution and asset review

Reviewed for this educational fork on October 18, 2026.

## Win11React

Original project: https://github.com/blueedgetechno/win11React

Original creator: blueedgetechno. Additional work by andrewstech and the
Win11React team and contributors. Upstream base: afb02e7 (August 2024).
The desktop layout, window management, app code, and other inherited source
originate in that project. Its CC0-1.0 dedication is retained verbatim in LICENSE.
This fork respects the upstream README's request for public acknowledgment.

CC0 applies to rights the dedicating authors hold. Its section 4 does not grant
trademark rights or clear third-party material. No claim is made that every asset
in the upstream repository was covered by its code license.

## Replacement artwork

The current tree replaces the upstream bundled raster assets (including Microsoft
and other product logos, wallpaper, profile photographs, game/store covers, and
setup illustrations) with independent geometric SVG drawings generated from
`scripts/generate-assets.mjs`. The complete output list is in
`scripts/asset-paths.json`. The previous Spotify and SettingsIcons font files and
unused native wrapper icon have been removed. Custom inline toolbar artwork and
the whiteboard pencil have also been redrawn. Font glyphs are no longer needed
for Settings icons. System fonts are referenced by name, not redistributed.

New artwork and the generator are dedicated under the repository's CC0-1.0 terms.
The generator contains no traced vendor artwork. Generic fallback art is used for
remote images passed to the shared image renderer, and cached news background
photographs have been replaced with local fallback artwork. Replacing these
assets is a precaution based on missing provenance, not a finding of infringement.

Historical commits in the public upstream/fork network still contain the old
assets; they are not part of this fork's current build. Product names identify
the simulated applications and do not imply endorsement. External services opened
by inherited demo apps have their own content and terms.

## Font Awesome Free

Fonticons, Inc. — https://fontawesome.com

The Free Solid and Free Regular SVG icons supplied through npm are used unchanged.
Icons: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ .
Font Awesome code: MIT. No Font Awesome fonts are bundled by this fork.
The package license notices are distributed in `public/licenses/FONT-AWESOME.txt`
and `public/licenses/FONT-AWESOME-CODE.txt`; these are included in the static build.

## dyCalendarJS

Copyright (c) 2016 Yusuf Shakeel — MIT.
Source: https://github.com/yusufshakeel/dyCalendarJS

Used in `public/dycalendar.js` and `public/dycalendar.css`, with original headers
preserved. Full MIT notice is distributed in `public/licenses/DYCALENDAR.txt`.

## Dependencies

React, Redux, Vite, and the other npm dependencies retain their respective
licenses and package notices. The top-level CC0 dedication does not relicense
them. Dependency versions are recorded in package-lock.json. No blanket legal
clearance of third-party packages or trademarks is claimed.
