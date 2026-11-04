# Wearit design rules

The one reference for how the Wearit storefront looks and behaves. Check every UI change against it. It is written for a shop: the content is the product, the accent is red, English only, light theme only.

Owner preference: **familiar design**, in the spirit of Apple's interface guidelines. Standard patterns people already know beat clever ones. Nothing ships unless it passes the checklist at the bottom.

Sources: [Figma, UI design principles](https://www.figma.com/resource-library/ui-design-principles/), [UX Design Institute, UX principles 2026](https://www.uxdesigninstitute.com/blog/ux-design-principles-2026/), Apple Human Interface Guidelines (from general knowledge; check exact values on developer.apple.com/design), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Principles

| #   | Principle                         | In practice                                                                                                                               |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Clarity**                       | Every element has a purpose and is legible at a glance. Text over decoration.                                                             |
| 2   | **Deference**                     | The interface serves the content. For Wearit the content is the product: photo, name, price, size and colour.                             |
| 3   | **Hierarchy**                     | One main thing per screen, a few secondary things, the rest quiet. Size, weight, contrast and spacing carry the order. One `h1` per page. |
| 4   | **Consistency**                   | Same component, same look, same behaviour everywhere. One spacing scale, one radius, one shadow, one set of icons.                        |
| 5   | **Familiar patterns**             | Header with menu, cart bag icon, product grid, size chips, quantity stepper, confirm dialogs, back always works.                          |
| 6   | **Proximity and alignment**       | Group what belongs together (price with name, quantity with its item), separate what does not, align to a grid.                           |
| 7   | **Contrast**                      | The primary action is the loudest thing (filled red button). Secondary actions are quieter. Destructive actions are confirmable.          |
| 8   | **Progressive disclosure**        | Show only what this step needs. Filters, long descriptions and the order summary collapse.                                                |
| 9   | **Context**                       | Design for a phone in one hand, on a bad connection, in sunlight, in a hurry.                                                             |
| 10  | **User control**                  | Undo, cancel, clear filters, and a way out of every state. Cancel comes first in confirm dialogs.                                         |
| 11  | **Accessibility**                 | Contrast, tap size, labels, keyboard use, readable text sizes, reduced motion.                                                            |
| 12  | **Usability**                     | Easy to learn, fast to use, hard to get wrong.                                                                                            |
| 13  | **Simplicity**                    | Less to read, less to decide, fewer elements per screen. Remove what the screen works without.                                            |
| 14  | **Feedback and responsiveness**   | Every tap gets an immediate visible response (pressed state, spinner, toast, status).                                                     |
| 15  | **Error prevention and recovery** | Validate while typing, disable impossible actions, explain errors in plain words and say how to fix them.                                 |
| 16  | **Aesthetics**                    | Clean look, generous white space, good product photos, one brand style (red, type, radius). Beauty supports the product, never competes.  |
| 17  | **Adaptability**                  | One consistent experience from small phone to desktop, portrait and landscape.                                                            |

## Rules you can check

**Layout: phone first (350 to 430 px wide), then tablet and desktop**

- Side margins 16px on phones. Spacing from one scale: 4, 8, 12, 16, 24, 32, 48.
- Tap targets at least 44 x 44px (icon buttons, chips, steppers, pagination, links in the footer), with at least 8px between neighbours.
- No horizontal scrolling of the page. Wide content (the featured strip, tables) scrolls inside its own container. Must also hold at 200% text and at 320px.
- The first screen shows real content (products), not an empty banner.
- Keep content clear of the notch and the home indicator (safe-area insets; `viewport-fit=cover`).
- No one-word lines in titles; product names clamp to 2 lines in grids and keep their full text on the detail page.

**Type**

- Body text and inputs 16px or more (smaller makes iOS zoom into inputs). Page title 24 to 30px on a phone. Section titles 18 to 22px.
- Never a heading on 3 lines on a phone. Clamp hero titles.
- Text sizes in rem, never fixed px, so text scales with the user's font setting. No text under 12px.
- One typeface (the system font stack set in the MUI theme and `index.css`).

**Colour**

- Brand red `#E60023` is the one accent: primary buttons, active nav, prices. Text contrast at least 4.5 : 1 (large text 3 : 1); `#6b6b6b` is the lightest allowed text colour on white and on the light grey backgrounds (`#efefef`, `#f9f9f9`). Colour never carries meaning alone: pair it with text, an icon or `aria-pressed`.
- Semantic colours (green, amber) only for status text that also reads without colour ("FREE", "Sale"), and they must pass 4.5 : 1 on their background.
- Text over photos sits on a 60 to 70% black overlay.

**Motion**

- Respect "reduce motion": no auto-advancing carousels or auto-scrolling, no running animations.
- Pressed state on tappable things is CSS and instant.

**Forms**

- Validate as the user types or on blur, not only on submit. Keep the submit button enabled and explain what is missing. Focus the first error.
- Keep what the user typed after an error.
- Right keyboard for each field: `type=email`, `type=tel` with `inputmode=tel`, `autocomplete` values (`name`, `email`, `tel`, `current-password`, `new-password`), password with a show toggle that has a label.
- Every input has a visible or `aria-label` label. Required fields say so.

**Photos**

- Product photos keep one aspect ratio per context (grid cards, detail, thumbnails), never stretch. Use `object-fit`.
- Calm placeholder while loading and when missing or broken. Every image has alt text (product name); decorative images have empty alt.
- Photos below the first screen load lazily.

**Every state is designed**

- Loading (spinner or skeleton, not a blank page), empty (say what to do next, e.g. empty cart, no products for these filters), error (say what went wrong and how to fix it), long name, no image, offline.
- No raw API text or error codes anywhere in the UI.

**Behaviour**

- One primary action per screen.
- Destructive actions (empty the whole cart, delete a review, cancel an order) ask first with a confirm dialog. Reversible one-tap actions (remove one item with the stepper, change quantity) do not need one.
- Every mutation gives feedback within 100 ms: pressed state, pending text or spinner on the button, toast on success and error. A button that submits is disabled while it waits, so a double tap cannot order twice.
- Filters and search: collapsed behind a "Filters" button on phones, with a count of active filters and a way to clear them.
- Icon-only buttons have an `aria-label`. Menus and modals trap focus and close with Escape (MUI does this when used as intended).

## Deliberate exceptions

- No dark theme. The storefront is light only; add a theme rather than patching colours if it is ever wanted.
- Small meta text (card details, fine print) is 12px, not 14px or more.
- Links inside long legal or FAQ text can be under 44px tall (WCAG 2.5.8 inline-link exception).
- Desktop widths (1024px and up) keep their denser, mouse-sized layout; the 44px rule applies at touch widths (below 1024px). The check script tests tap targets at 350 and 700px and everything else at all four widths.

## Known gaps (not done)

See [PROGRESS.md](../PROGRESS.md) for the current list after the last audit.

## Definition of done for a design change

1. Looked at yourself, in screenshots or the browser, at **350, 700, 1050 and 1400 px**, plus phone landscape for anything with a fixed bar. Cover the screen and its states: filters open and closed, empty, error, long name, missing photo, modal and menu open.
2. Checked automatically or by hand at those four widths: no horizontal overflow, tap targets of at least 44px at touch widths, text of at least 12px, no stretched images, no clipped text, no overlapping controls, one `h1`, named buttons.
3. Contrast checked on new colours.
4. `npm run lint`, `npm test` and `npm run build` pass. Logic changes tested end to end.
5. One logical change per commit.
