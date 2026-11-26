# Nadeeshi — Personal Portfolio

A static, framework-free portfolio (HTML · CSS · JavaScript). Open `index.html` in a browser, or serve the folder
(`npx serve .` / VS Code Live Server). Works as-is on GitHub Pages / Netlify — `404.html` is included.

## Structure
```
index.html            home (hero, about, 3D work carousel, contact)
education.html        timeline
gallery.html          filterable gallery + keyboard-friendly lightbox
projects.html         Java projects
assignments.html      HTML/CSS assignments  ->  assignments/assignment-1..5.html (live previews)
notes.html            downloadable PDF notes
assets/css            base.css (design system, shared) · home.css · pages.css · preview.css
assets/js             main.js (all pages) · home.js · gallery.js
assets/images         WebP images · assets/pdf  study notes
```

## Things to edit
- **Email / social links:** `index.html` (contact + nav) — search for `nadeeshisavindi`.
- **Stock Management project link:** `projects.html` — replace the "Source coming soon" button with a GitHub link.
- **Education page:** check the programme progress (65%) and wording are still current.
- **Contact form:** there is no server, so it opens the visitor's email app with the message pre-filled.
  For a real inbox form, point it to Formspree / Netlify Forms.
