# XMB Portfolio

A personal portfolio site built around the PS3 XMB (XrossMediaBar) interface. Menu items lead to CV, about, projects, and contact sections, plus a playable build of Doom running as a WebAssembly module.

This is an unofficial fan project and is not affiliated with Sony.

## Tech Stack

- React + Vite
- Redux Toolkit (state management)
- GSAP (animation)
- Tailwind CSS
- Web Audio API (runtime sound synthesis)
- WebGL (wave background)
- WebAssembly (Doom, via [doom.wasm](https://github.com/jacobenget/doom.wasm))

## Status

Actively in development. See `TODO.md` for the running notes.

## License

This project's own code is MIT — see `LICENSE`.

It also distributes third-party software under different licenses, most notably the
Doom engine (**GPL-2**) and the Doom shareware WAD (**id Software shareware license**).
These are documented, with the required source offer, in
[`LICENSES.md`](LICENSES.md). The GPL-2 text ships alongside the binary at
`public/doom/LICENSE`.

DOOM is a trademark of id Software LLC. This is an unofficial fan project, not
affiliated with id Software or Sony.