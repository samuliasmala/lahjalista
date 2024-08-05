## Getting Started

### What TIPS.md includes?

TIPS.md includes tips&tricks that will make developing / editing the Lahjalista project a bit easier

## Tips and tricks

#### (VSCODE) Configure Tailwind IntelliSense to accept other attribute names than "className"

Edit `tailwindCSS.classAttributes` in VSCode's settings and add a new item called `.*ClassName`. This will allow custom className (eg. `checkMarkClassName`) classes to have TailwindCSS IntelliSense

### (ERROR NOT FOUND YET) Work around for error "require() of ES Module /node_modules/prettier-plugin-tailwindcss/dist/index.mjs not supported" after `npm run svgr` command

Remove the following line: `"plugins": ["prettier-plugin-tailwindcss"]` inside `.prettierrc` file. Try to run `npm run svgr` command again, should now work.
