# Blank-Shell Publication State

## Goal

Publish the completed portfolio structure at `lucasxl.com` while Lucas's verified biography, projects, experiences, and contact details are still being prepared.

## Visible content

- Keep the name `Lucas Xin`, global navigation, language switch, page titles, timeline heading, contact call to action, and footer.
- Remove the generic identity and introductory sentences from the home page.
- Keep About, Resume, and Contact as title-only structural pages while their verified content is absent.
- Keep the timeline empty until at least one verified entry is deliberately marked `published`.
- Keep English as the default language and preserve same-URL Chinese switching.

## Implementation

- Store absent identity and introduction copy as empty strings in the existing profile data contract.
- Render the identity and introduction blocks only when their selected-language content is non-empty, so the home page does not contain blank paragraphs.
- Preserve the existing file-based authoring workflow; no content route, schema, or deployment behavior changes.

## Verification

- Unit or browser coverage confirms the generic identity and introduction are absent from the rendered home page.
- Existing language, navigation, accessibility, content-validation, build, and browser gates remain green.
- A push to `main` triggers the existing Cloudflare Pages deployment for `lucasxl.com`.

## Future content release

Verified profile copy can be restored in `src/data/profile.ts`. Projects and experiences remain draft-only until their metadata is changed to `published` after content review.
