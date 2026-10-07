# Kadiri Study Circle

React attendance app with Andhra Pradesh and Sri Sathya Sai district branding.

## Run and verify

```sh
bun install
bun run dev
bun run lint
bun run test
bun run build
```

The development server defaults to port 3000. Use `bun run dev --port 5173` for the existing preview address.

## Project layout

- `src/`: attendance interface, management portals, shared state and design tokens.
- `public/assets/`: the logos used by the web app.
- `tests/`: attendance regression tests.
- `mobile/`: the separate Flutter attendance app; see its README.
- `design/attendance-audit/`: retained design report, measurements and screenshots.
- `.agents/`: project design skills.
- `.openai/hosting.json`: the existing Sites project identity.

Attendance and demo sessions are stored in the browser. Secure cloud sign-in and synchronization are not connected.

## Publishing source

The [published attendance app](https://vitaforge-daily-kadiri.collector-ss-1020.chatgpt.site) remains private. Reuse the project ID in `.openai/hosting.json`.

The separate Sites Git checkout was moved out of this folder during cleanup and preserved in the local recovery backup. Its location is machine-specific.

The root checkout is the canonical source. For future publication, refresh the separate Sites checkout from the root, rebuild, and use the Sites publishing workflow with that checkout. Do not push the root GitHub repository to the Sites remote or create a second Site.

Obsolete prototypes are preserved in the local recovery backup with a `restore-map.json` file. They are not required to run the app.
