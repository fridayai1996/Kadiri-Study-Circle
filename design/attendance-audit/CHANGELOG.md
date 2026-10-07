# Attendance app change log

- Reconnected the entry point to the real attendance context; retained the unused phone prototype in source.
- Replaced the wellness direction with attendance, student register, saved reports and account navigation.
- Applied the iOS design skill to the existing React web app: system font, content-driven scrolling, native form controls, safe areas and reduced-motion support.
- Added the supplied Andhra Pradesh government and Sri Sathya Sai district logos without altering them.
- Centralized colors, typography, spacing, shapes and motion in `src/design-tokens.css`.
- Added one persistent primary action per main screen, labeled search/date/class fields, full-word attendance states, keyboard focus and unsaved-change protection.
- Reports use saved data; an unrecorded day displays no result rather than a misleading zero percent.
- Attendance corrections preserve cumulative totals. Partial updates preserve other students. Three regression tests cover these behaviors.
- Removed external font loading; added a theme color and local favicon.
- Restored management access through Account, updated its branding and reduced page overflow. Its older workflows remain outside the clean main-screen result.
- Prepared the existing Sites project for private publication under the Kadiri Study Circle title. Its original URL slug cannot be renamed with the available metadata tool.

Validation: `bun test tests/attendance.test.ts` (3 pass), `bun run lint`, `bun run build`. The existing React 19 / Tailwind 4 project was preserved rather than migrated to the older versions named in the original mockup brief.

Data limitation: browser storage and demo sessions remain. Supabase discovery returned no available projects on 7 October 2026. No secure cloud authentication or synchronization is claimed.
