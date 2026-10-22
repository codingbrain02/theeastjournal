# The East Journal

A responsive patient-safety guide inspired by the structure of the Ast Journal demo, redesigned as an independent editorial site.

## Run locally

```bash
npm install
npm run dev
```

To receive call-back requests, copy `.env.example` to `.env` and set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. The Vite development server reads these values for its `/api/callback` endpoint. Keep `.env` private.

For production, build the Docker image and set the same environment variables on the container. The container serves the site and API on port 80. The bot must be able to send messages to the configured chat.

Use `npm run build` for a production build and `npm run lint` for static checks.

## Project notes

- Built with React, TypeScript, Vite, and Tailwind CSS 4.
- All 19 article and medication images are stored in `public/images`; the site does not load images from the reference domain.
- The schedule filter, responsive navigation, and reading-progress bar work in the browser.
- The call-back form sends its fields to the configured Telegram chat. The site does not arrange a prescription or process payments.
- External links to FDA, DEA, NABP, and eCFR resources are listed in the Sources section.
