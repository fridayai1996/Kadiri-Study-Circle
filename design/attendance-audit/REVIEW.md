# Kadiri Study Circle — design review

Reviewed 7 October 2026. Primary viewports: 390×844, 360×800, 768×1024.

**Result: main attendance interface passes the measured visual criteria; the app-wide exit criteria are not fully met.** The older management portal still contains narrow controls and competing actions. Five iterations have been reached. Cloud operation is separately blocked: Supabase discovery returned an empty project list. Publication is an owner-private browser-local demo, not a secure multi-user records system.

## Evidence and method

Screenshots cover Attendance, Students, Reports and Account at all three widths in every saved iteration. Login and the faculty portal have additional captures. Raw measurements are in `iteration-1-metrics.json`, `iteration-2-metrics.json`, `iteration-3-metrics.json`, `final-metrics.json`, and `final-portal-metrics.json`. Use [the screenshot gallery](gallery.html) for before/after comparisons. Earlier iteration descriptions are reconstructed from the retained work and evidence; they are not new runs.

Measured geometry is from rendered DOM; browser console inspection returned no errors or warnings. Main-screen controls were at least 48×48px; text was at least 16px; no page-level horizontal overflow. Fresh-load CLS was 0. The 0.087 value in iteration 4 includes development hot updates to the legacy portal, so is not a production-load measurement. Tablet screenshot capture clips some of the bottom chrome in this browser; DOM geometry confirms navigation labels lie inside the 1024px viewport (label bottom 1010px).

Typography: system sans-serif, 16/20/32/48px, line height 1.5 for body. Spacing: 4/8/12/16/24/32/48px. Signature: district navy, a restrained orange rule, and the supplied official emblems. Primary buttons use white on navy. Palette contrast ratios range from 5.72:1 for the tested disabled combination to 13.88:1 for primary text. This does not certify all legacy portal colors or text inside supplied logos.

## Iteration 1 — Attendance foundation

Replaced the constrained mockup direction with task-focused tabs, readable tokens and flat register rows.

Changes: src/components/AttendanceMobile.tsx; src/design-tokens.css; src/attendance-theme.css; src/App.tsx.

### Top ten tracked problems

The table tracks the original ranked findings; resolved findings are retained for comparison rather than inventing new problems.

# | Screen | Problem | Impact | Fix / status
---|---|---|---|---
1 | All | Wellness-style entry obscured the attendance task | High / frequent / medium | Restore attendance context and task-specific copy — Fixed
2 | All | Fixed phone frame restricted narrow layouts | High / frequent / low | Use a responsive scrolling page and safe areas — Fixed
3 | All | Small labels and weak contrast | High / frequent / medium | 16px floor and verified foreground/background tokens — Fixed
4 | Attendance | Drag-only confirmation and decorative voice action | High / frequent / medium | Use a labeled, keyboard-accessible save button — Fixed
5 | All | Inconsistent shapes, spacing and typography | Medium / frequent / medium | Centralize reusable design tokens — Fixed
6 | Navigation | Primary action could leave the thumb zone | High / frequent / low | Persistent action above four peer tabs — Follow-up
7 | Attendance | Drafts could be lost during navigation | High / occasional / medium | Preserve drafts across tabs; confirm day/portal changes — Follow-up
8 | Reports | Unsaved/empty data could imply a recorded result | High / occasional / low | Read saved history and show an explicit empty state — Follow-up
9 | Attendance | Repeat saves could inflate attendance totals | High / occasional / medium | Idempotent daily corrections and regression tests — Follow-up
10 | Management portal | Dense legacy UI and some narrow controls | High / frequent / high | Wrap overflow; further portal redesign remains — Partial; remains

Before: before-[screen]-[width].png. After: iteration-1-[screen]-[width].png, in [gallery](gallery.html).

Remaining/new issues: Main screen geometry passed. Primary placement and portal work remained.

Criterion | Result
---|---
What / who / why / next above fold | Pass on four main screens; all legacy entry paths not certified
Single primary CTA, targets ≥44px | Main screens pass; placement improved next iteration; portal fails
Contrast ≥4.5:1, body ≥16px, no horizontal scroll | Main screens pass; legacy contrast not fully verified
Consistent token-based scale | Main screens pass; legacy styles partially normalized
No generic gradients/card/pill clutter | Main screens pass; legacy portal remains dense
Two consecutive clean reviews | Not yet established app-wide

## Iteration 2 — Actions and login

Made the primary action persistent, simplified demo login, protected drafts and clarified saved reports.

Changes: src/components/AttendanceMobile.tsx; src/components/LoginScreen.tsx; src/attendance-theme.css.

### Top ten tracked problems

The table tracks the original ranked findings; resolved findings are retained for comparison rather than inventing new problems.

# | Screen | Problem | Impact | Fix / status
---|---|---|---|---
1 | All | Wellness-style entry obscured the attendance task | High / frequent / medium | Restore attendance context and task-specific copy — Fixed
2 | All | Fixed phone frame restricted narrow layouts | High / frequent / low | Use a responsive scrolling page and safe areas — Fixed
3 | All | Small labels and weak contrast | High / frequent / medium | 16px floor and verified foreground/background tokens — Fixed
4 | Attendance | Drag-only confirmation and decorative voice action | High / frequent / medium | Use a labeled, keyboard-accessible save button — Fixed
5 | All | Inconsistent shapes, spacing and typography | Medium / frequent / medium | Centralize reusable design tokens — Fixed
6 | Navigation | Primary action could leave the thumb zone | High / frequent / low | Persistent action above four peer tabs — Fixed
7 | Attendance | Drafts could be lost during navigation | High / occasional / medium | Preserve drafts across tabs; confirm day/portal changes — Fixed
8 | Reports | Unsaved/empty data could imply a recorded result | High / occasional / low | Read saved history and show an explicit empty state — Fixed
9 | Attendance | Repeat saves could inflate attendance totals | High / occasional / medium | Idempotent daily corrections and regression tests — Implementation present; regression validation pending
10 | Management portal | Dense legacy UI and some narrow controls | High / frequent / high | Wrap overflow; further portal redesign remains — Partial; remains

Before: iteration-1-[screen]-[width].png. After: iteration-2-[screen]-[width].png, in [gallery](gallery.html).

Remaining/new issues: Main layouts passed. Full portal and latest official branding remained.

Criterion | Result
---|---
What / who / why / next above fold | Pass on four main screens; all legacy entry paths not certified
Single primary CTA, targets ≥44px | Main screens pass; portal fails
Contrast ≥4.5:1, body ≥16px, no horizontal scroll | Main screens pass; legacy contrast not fully verified
Consistent token-based scale | Main screens pass; legacy styles partially normalized
No generic gradients/card/pill clutter | Main screens pass; legacy portal remains dense
Two consecutive clean reviews | Not yet established app-wide

## Iteration 3 — Apple-inspired theme and official identity

Reconnected the working register after the phone prototype became the entry point; added supplied logos, system typography and district palette. Corrected partial/repeated attendance updates.

Changes: src/App.tsx; src/components/InstitutionBrand.tsx; src/components/Header.tsx; src/design-tokens.css; src/attendance.ts; src/context/AppContext.tsx; tests/attendance.test.ts; index.html.

### Top ten tracked problems

The table tracks the original ranked findings; resolved findings are retained for comparison rather than inventing new problems.

# | Screen | Problem | Impact | Fix / status
---|---|---|---|---
1 | All | Wellness-style entry obscured the attendance task | High / frequent / medium | Restore attendance context and task-specific copy — Fixed
2 | All | Fixed phone frame restricted narrow layouts | High / frequent / low | Use a responsive scrolling page and safe areas — Fixed
3 | All | Small labels and weak contrast | High / frequent / medium | 16px floor and verified foreground/background tokens — Fixed
4 | Attendance | Drag-only confirmation and decorative voice action | High / frequent / medium | Use a labeled, keyboard-accessible save button — Fixed
5 | All | Inconsistent shapes, spacing and typography | Medium / frequent / medium | Centralize reusable design tokens — Fixed
6 | Navigation | Primary action could leave the thumb zone | High / frequent / low | Persistent action above four peer tabs — Fixed
7 | Attendance | Drafts could be lost during navigation | High / occasional / medium | Preserve drafts across tabs; confirm day/portal changes — Fixed
8 | Reports | Unsaved/empty data could imply a recorded result | High / occasional / low | Read saved history and show an explicit empty state — Fixed
9 | Attendance | Repeat saves could inflate attendance totals | High / occasional / medium | Idempotent daily corrections and regression tests — Fixed
10 | Management portal | Dense legacy UI and some narrow controls | High / frequent / high | Wrap overflow; further portal redesign remains — Partial; remains

Before: iteration-2-[screen]-[width].png. After: iteration-3-[screen]-[width].png, in [gallery](gallery.html).

Remaining/new issues: Main screens passed geometry checks. Portal overflow corrected, but narrow targets and busy hierarchy remained.

Criterion | Result
---|---
What / who / why / next above fold | Pass on four main screens; all legacy entry paths not certified
Single primary CTA, targets ≥44px | Main screens pass; portal fails
Contrast ≥4.5:1, body ≥16px, no horizontal scroll | Main screens pass; legacy contrast not fully verified
Consistent token-based scale | Main screens pass; legacy styles partially normalized
No generic gradients/card/pill clutter | Main screens pass; legacy portal remains dense
Two consecutive clean reviews | Not yet established app-wide

## Iteration 4 — First final review

Rechecked the four main screens at all widths. No new high-impact main-screen layout issues were found.

Changes: No design changes in this review; see iteration-4 screenshots and final-metrics.json..

### Top ten tracked problems

The table tracks the original ranked findings; resolved findings are retained for comparison rather than inventing new problems.

# | Screen | Problem | Impact | Fix / status
---|---|---|---|---
1 | All | Wellness-style entry obscured the attendance task | High / frequent / medium | Restore attendance context and task-specific copy — Fixed
2 | All | Fixed phone frame restricted narrow layouts | High / frequent / low | Use a responsive scrolling page and safe areas — Fixed
3 | All | Small labels and weak contrast | High / frequent / medium | 16px floor and verified foreground/background tokens — Fixed
4 | Attendance | Drag-only confirmation and decorative voice action | High / frequent / medium | Use a labeled, keyboard-accessible save button — Fixed
5 | All | Inconsistent shapes, spacing and typography | Medium / frequent / medium | Centralize reusable design tokens — Fixed
6 | Navigation | Primary action could leave the thumb zone | High / frequent / low | Persistent action above four peer tabs — Fixed
7 | Attendance | Drafts could be lost during navigation | High / occasional / medium | Preserve drafts across tabs; confirm day/portal changes — Fixed
8 | Reports | Unsaved/empty data could imply a recorded result | High / occasional / low | Read saved history and show an explicit empty state — Fixed
9 | Attendance | Repeat saves could inflate attendance totals | High / occasional / medium | Idempotent daily corrections and regression tests — Fixed
10 | Management portal | Dense legacy UI and some narrow controls | High / frequent / high | Wrap overflow; further portal redesign remains — Partial; remains

Before: iteration-3-[screen]-[width].png. After: iteration-4-[screen]-[width].png, in [gallery](gallery.html).

Remaining/new issues: Main-screen pass; app-wide fail because of remaining portal issues.

Criterion | Result
---|---
What / who / why / next above fold | Pass on four main screens; all legacy entry paths not certified
Single primary CTA, targets ≥44px | Main screens pass; portal fails
Contrast ≥4.5:1, body ≥16px, no horizontal scroll | Main screens pass; legacy contrast not fully verified
Consistent token-based scale | Main screens pass; legacy styles partially normalized
No generic gradients/card/pill clutter | Main screens pass; legacy portal remains dense
Two consecutive clean reviews | Not yet established app-wide

## Iteration 5 — Second final review

Reloaded and repeated the main-screen review. Captured portal/login at all widths. Verified a saved register can be re-saved with unchanged totals; confirmation appears.

Changes: No further design changes; see iteration-5 screenshots, saved-register-confirmation.png and final-portal-metrics.json..

### Top ten tracked problems

The table tracks the original ranked findings; resolved findings are retained for comparison rather than inventing new problems.

# | Screen | Problem | Impact | Fix / status
---|---|---|---|---
1 | All | Wellness-style entry obscured the attendance task | High / frequent / medium | Restore attendance context and task-specific copy — Fixed
2 | All | Fixed phone frame restricted narrow layouts | High / frequent / low | Use a responsive scrolling page and safe areas — Fixed
3 | All | Small labels and weak contrast | High / frequent / medium | 16px floor and verified foreground/background tokens — Fixed
4 | Attendance | Drag-only confirmation and decorative voice action | High / frequent / medium | Use a labeled, keyboard-accessible save button — Fixed
5 | All | Inconsistent shapes, spacing and typography | Medium / frequent / medium | Centralize reusable design tokens — Fixed
6 | Navigation | Primary action could leave the thumb zone | High / frequent / low | Persistent action above four peer tabs — Fixed
7 | Attendance | Drafts could be lost during navigation | High / occasional / medium | Preserve drafts across tabs; confirm day/portal changes — Fixed
8 | Reports | Unsaved/empty data could imply a recorded result | High / occasional / low | Read saved history and show an explicit empty state — Fixed
9 | Attendance | Repeat saves could inflate attendance totals | High / occasional / medium | Idempotent daily corrections and regression tests — Fixed
10 | Management portal | Dense legacy UI and some narrow controls | High / frequent / high | Wrap overflow; further portal redesign remains — Partial; remains

Before: iteration-4-[screen]-[width].png. After: iteration-5-[screen]-[width].png, in [gallery](gallery.html).

Remaining/new issues: Main-screen pass; app-wide fail. Stop at the requested five-iteration cap.

Criterion | Result
---|---
What / who / why / next above fold | Pass on four main screens; all legacy entry paths not certified
Single primary CTA, targets ≥44px | Main screens pass; portal fails
Contrast ≥4.5:1, body ≥16px, no horizontal scroll | Main screens pass; legacy contrast not fully verified
Consistent token-based scale | Main screens pass; legacy styles partially normalized
No generic gradients/card/pill clutter | Main screens pass; legacy portal remains dense
Two consecutive clean reviews | Pass for main screens (4 and 5); fail app-wide

## Functional validation

- Three automated tests pass: same-day idempotence, correcting present to absent, and partial-class preservation with late counted as attending.
- TypeScript and production build pass.
- Browser verified search filtering, tab navigation, saved-date navigation, attendance save confirmation, sign-out, faculty demo entry, and management portal access.
- A re-save used the existing 27 September record with the same status; no changed attendance outcome was intentionally retained.
- No full mobile Safari, physical keyboard, screen-reader or operating-system large-text certification was performed.

## Residual risks and blockers

1. Supabase has no available project in the connected account. Secure auth, RLS-backed storage, cloud backup and multi-device sync are not implemented.
2. Browser storage can be cleared or unavailable; the UI states its local-only scope. Demo role checks are not a security boundary.
3. The older faculty portal still includes controls approximately 32px wide on mobile, multiple actions and a long introductory area. Admin/student portal subflows were not comprehensively reviewed, so no universal accessibility claim is made. Hidden tablet buttons account for zero dimensions in the raw portal metrics and are not themselves visible-target failures.
4. Existing seeded student/faculty data is bundled. Publication remains owner-private. Validate data and permissions before any wider release.
5. Native date-field automation did not commit a direct fill in this embedded browser; saved-register selection and day navigation are available. Real iPhone date-picker behavior remains to be checked.
6. Existing Vite configuration emits a non-blocking future config-loader warning. No framework migration was made.

## Delivery

Published successfully, owner-private: [Kadiri Study Circle attendance](https://vitaforge-daily-kadiri.collector-ss-1020.chatgpt.site). The original URL slug remains from initial registration; display title and app content are Kadiri attendance.

Source commit for the published Sites snapshot: `0a74b76cd6729104163b60b7358a015bda7de5f3`. The GitHub repository is the canonical application source; its subsequent cleanup does not change that published snapshot.

Design tokens: `src/design-tokens.css`. [Change log](CHANGELOG.md). [All screenshots](gallery.html).
