# Third-Party Licenses

This project (XMB Portfolio) is licensed under the MIT License — see [`LICENSE`](LICENSE).

It **distributes and loads third-party software that is licensed separately**. Those
components are listed below. Their licenses govern them, not the MIT license above.

---

## 1. Doom engine — `public/doom/doom.wasm`

| | |
|---|---|
| **Component** | `doom.wasm` — the Doom engine compiled to a single WebAssembly module |
| **Upstream** | https://github.com/jacobenget/doom.wasm |
| **Version distributed** | Release `v0.1.0`, asset `doom-v0.1.0.wasm` (4,559,928 bytes) |
| **License** | **GNU General Public License, version 2** — full text in [`public/doom/LICENSE`](public/doom/LICENSE) |
| **Modifications** | **None.** The binary is the unmodified upstream release artifact, byte for byte. |

`doom.wasm` derives from id Software's Doom source release and, by way of
[doomgeneric](https://github.com/ozkl/doomgeneric), from fbDOOM, Frosted Doom and
Chocolate Doom. Copyright remains with id Software and the respective contributors.

### Written offer for corresponding source (GPL-2 §3)

The complete corresponding source code for the `doom.wasm` binary distributed here is
publicly available at:

> https://github.com/jacobenget/doom.wasm/releases/tag/v0.1.0

The binary in `public/doom/` was built by the upstream project from exactly that source
and is redistributed here unmodified. Anyone who receives the binary from this site is
entitled to that source under the terms of GPL-2. If the upstream repository ever becomes
unavailable, contact the maintainer of this repository and a copy of the corresponding
source will be supplied on physical media or by download, at no charge beyond the cost of
distribution, as GPL-2 §3(b) requires.

### Why the binary lives in `public/`

`public/doom/doom.wasm` is served as a standalone static asset and fetched at runtime by
`WebAssembly.instantiateStreaming`. It is deliberately **not** processed by the bundler
and not linked into this project's JavaScript. The host code in
[`src/game/doomHost.js`](src/game/doomHost.js) was written from scratch against the
module's published interface (`doom.wasm.interface.txt`) rather than copied from
upstream's example glue, so no GPL-licensed source is incorporated into this project's
own code. The two remain separate works distributed together — aggregation, not a
combined work.

---

## 2. Doom Shareware WAD — embedded inside `doom.wasm`

| | |
|---|---|
| **Component** | `DOOM1.WAD` (Doom shareware game data), embedded in the `doom.wasm` binary |
| **License** | id Software shareware license — **not** GPL, and **not** MIT |
| **Copyright** | © id Software LLC |

This is a distinct license from the engine's. id Software released the Doom **engine
source** under GPL-2 but retained a proprietary license on the **game data**. The
shareware WAD may be redistributed as unmodified shareware; it may not be sold, and the
registered (non-shareware) Doom WADs may not be redistributed at all.

The WAD is embedded in the upstream `doom.wasm` binary and is loaded automatically when
the host supplies no WAD data of its own — which is what this project does (see the
`loading.wadSizes` / `loading.readWads` stubs in `doomHost.js`).

> If stricter licensing is ever required, the module supports supplying a WAD through
> `loading.wadSizes` / `loading.readWads`. [Freedoom](https://freedoom.github.io/) is a
> BSD-licensed, fully free replacement WAD that could be used instead.

---

## Trademark notice

DOOM is a trademark of id Software LLC. PlayStation and XrossMediaBar are trademarks of
Sony Interactive Entertainment Inc. This project is an unofficial fan work and is not
affiliated with, endorsed by, or sponsored by either company.
