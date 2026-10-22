# The East Journal

A responsive patient-safety guide inspired by the structure of the Ast Journal demo, redesigned as an independent editorial site.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for a production build and `npm run lint` for static checks.

## Project notes

- Built with React, TypeScript, Vite, and Tailwind CSS 4.
- All 19 article and medication images are stored in `public/images`; the site does not load images from the reference domain.
- The schedule filter, responsive navigation, and reading-progress bar work in the browser.
- The call-back form is an interactive demo. Inputs remain in the open browser form, are not sent or stored by this app, and do not arrange a real call or prescription.
- External links to FDA, DEA, NABP, and eCFR resources are listed in the Sources section.
