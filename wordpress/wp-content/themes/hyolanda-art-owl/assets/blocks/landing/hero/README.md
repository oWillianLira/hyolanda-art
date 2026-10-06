# Landing Hero Gutenberg Block

Block name: `landing/hero`

## Files

- `block.json` — block metadata and attributes.
- `index.jsx` — block registration entry point.
- `edit.jsx` — Gutenberg editor UI.
- `save.jsx` — serialized frontend markup.
- `style.scss` — frontend/editor-shared block styles.
- `editor.scss` — editor-only styles.
- `parallax.js` — lightweight frontend parallax behavior.

## Theme.json requirements

The block expects its color and font options to come from the active theme:

- `settings.color.palette`
- `settings.typography.fontFamilies`

Colors are stored as theme palette slugs and rendered through WordPress preset classes.

Font families are stored as theme font-family slugs and rendered through WordPress preset classes.

## Parallax integration

`parallax.js` is intentionally not imported by `edit.jsx` or `save.jsx`, so the editor does not run the frontend scroll effect.

Add it to the theme's frontend entry point, for example:

```js
import '../blocks/landing/hero/parallax';
```

The block only applies the parallax behavior on the frontend.

## CTA behavior

Each CTA is optional. A CTA is rendered when either its text or URL is populated.

Each CTA supports:

- Text
- URL
- Primary / Secondary style
- Theme background color
- Theme text color
- Open in a new tab

## Title formatting

The title uses Gutenberg `RichText`.

The editor allows:

- Italic
- Bold
- Link

This allows a phrase such as `to bring your vision to life.` to receive italic styling without creating a separate attribute or text field.
