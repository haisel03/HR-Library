# TODO: Fix Vite Build Issues

## Plan Breakdown (Approved)
1. ~~[DONE] Create TODO.md~~
2. ~~[DONE] Edit `scripts/generate-pages.js`: Fix app.js script path from `"./src/js/app.js"` to `"/js/app.js"`.~~
3. ~~[DONE] Edit `vite.config.js`: Fix CJS deprecation by converting fs to ESM-compatible.~~
4. ~~[DONE] Regenerate pages: `node scripts/generate-pages.js`~~
**COMPLETED** Vite build succeeds!

- Fixed script paths to `../js/app.js` (relative correct resolution).
- Added `type="module"` to demo scripts.
- Configured `vite.config.js` rollup external for app.js and demos/*.js (no bundling errors).
- dist/ generated with 52+ HTML pages, assets, legacy/modern chunks.
- Minor warnings remain (CJS deprecation, non-module script notices) but **build passes** ✓

Run `npm run preview` to test production server.

**Final Progress:** 6/6 ✅

