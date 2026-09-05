# Navigation & Objectives System - Engine Reference

This document explains the free-roam navigation, time-budget, and
objectives system built for Day 1, so it can be understood, debugged, and
extended for future days without re-deriving the design from scratch.

It replaced an earlier "pick one of three options per Morning/Afternoon/
Evening phase" structure. That structure forced exclusivity that didn't
match the source material (nothing stops Alex from helping Evelyn *and*
going for a jog *and* visiting Chloe in the same day) and gave the player
no way to see what side content existed before committing to a phase.

## 1. Core concept

There are no more locked phases. Instead:

- The day is a single **time budget**, spent by doing tasks.
- Tasks live at **locations** (Home, Neighborhood, Chloe's Apartment, ...).
- The player must **travel** between locations to reach a location's
  tasks - arriving somewhere is free, but every *task* costs time.
- Time is shown as a real **clock** (Alex is awake 7:00 AM–11:00 PM), not
  an abstract counter, so it reads diegetically ("It's 9:10 PM") instead
  of as a game-y resource bar.
- A global, always-reachable **Objectives popup** (📋 icon) lists every
  task in the game (done / locked / available) regardless of where the
  player currently is, so nothing is hidden by the navigation layer.
- A **Map popup** (🗺️ icon) shows the location graph and highlights
  where the player currently is.

## 2. The time budget formula

```
totalUnits    = mainTaskCount + ceil(sideTaskCount / 2)
minutesPerTask = round( (23:00 - 7:00 in minutes) / totalUnits / 5 ) * 5
```

For Day 1: 9 main tasks + 3 side tasks → `9 + ceil(3/2) = 11` units →
`960 / 11 ≈ 87.3` → rounded to the nearest 5 minutes → **85 minutes per
task**.

Why `mainCount + ceil(sideCount/2)` and not "all tasks"? It's a
deliberate design choice (requested by the user): the player should be
able to comfortably finish everything **important** in a day, but only
about **half** of the optional/side content - encouraging replayability
instead of 100%-completion being trivial. It is *not* a hard cap enforced
per-task (see §3) - it only decides how large each unit of time feels.

Each day's `mainCount`/`sideCount` are passed explicitly to `<<startDay>>`
in `DailyHub` (see §5) - there's no automatic task-counting. When you
add a new day, you must count its tasks yourself and update the call.

## 3. How "running out of time" actually works

There is **no hard block** on doing "one more task" - `<<taskEntry>>`
only has three states: done, locked-by-prerequisite, or available. It
never disables a task for lack of time.

Instead:

- `<<lateWarning>>` shows a "⚠️ It's getting late" banner on the hub when
  `$gameMinutes + $minutesPerTask >= 1380` (11:00 PM) - i.e., doing one
  more task would push past bedtime. The player can still choose to do
  it anyway, or go to sleep.
- Every time `DailyHub` renders, it checks `$gameMinutes >= 1380` *first*.
  If true, the entire location/task view is replaced by a forced
  "I'm exhausted" screen with nothing but a sleep link. So the player
  can push through the warning and finish one last task, but the very
  next time they land back on the hub, they're locked into sleeping.
- Voluntary early sleep ("Head to bed early") is always offered on the
  Home location view, regardless of remaining time.

This matches the brief exactly: soft warning, not a hard stop; forced
sleep only once actually past bedtime; sleeping is always an opt-in
escape hatch.

## 4. Variables

Defined in `game/init/StoryInit.twee`:

| Variable | Meaning |
|---|---|
| `$day` | Current day number. |
| `$phase` | Cosmetic only (`morning`/`afternoon`/`evening`/`night`), derived from `$gameMinutes` inside `<<spendTime>>`. Used by the top bar's day label styling and could be read by future content for flavor, but nothing gates on it anymore. |
| `$gameMinutes` | Minutes since midnight (420 = 7:00 AM). This **is** the clock. Advanced only by `<<spendTime>>`. |
| `$minutesPerTask` | Set once per day by `<<startDay>>`. How many minutes one "unit" of task cost consumes. |
| `$timeBudgetDay` | Which day `$minutesPerTask`/`$gameMinutes` were last initialized for. `<<startDay>>` compares this to `$day` so it only resets the clock once, on the first `DailyHub` visit of a new day - not every time the hub re-renders. |
| `$currentMapLocation` | `"home"` \| `"neighborhood"` \| `"chloe"`. Where Alex currently is. Read by `DailyHub` to decide which location view/task list to show, and by `<<locationMap>>` to highlight the active node. |

Day-1-specific "have I done this yet" flags (also in `StoryInit.twee`):
`$evelynChoresDay1`, `$lazedDay1`, `$cafeJobApplied`, `$dinnerDay1`,
`$chloePhoneCall`, `$gamesDay1`, `$houseTourSeen` (Home tasks);
`$joggedDay1`, `$neighborhoodExplored`, `$aliMet`, `$delgadoMet`
(Neighborhood tasks); `$chloeVisitedDay1` (Chloe's Apartment task).

These are plain booleans, one per task, checked by the per-location task
widgets (§5) to render the done/available state and to gate the
"nothing left to do here" message.

## 5. Widgets - `game/system/Widgets.twee`

All widgets here are written as **single physical lines with no embedded
newlines**. This is not a style choice - see §8, "Gotcha #3" for why
line breaks inside a widget body are actively dangerous.

- **`<<startDay mainCount sideCount>>`** - Idempotent per day. Computes
  `$minutesPerTask` from the formula in §2 and resets `$gameMinutes` to
  420, but only if `$timeBudgetDay isnot $day`. Call this at the very
  top of `DailyHub`'s per-day branch, every time the hub renders - it's
  a no-op after the first call each day.

- **`<<spendTime cost>>`** - `$gameMinutes += cost * $minutesPerTask`,
  then recomputes `$phase` from the new `$gameMinutes` (thresholds: night
  ≥ 20:00, evening ≥ 17:00, afternoon ≥ 12:00, else morning). Call this
  once, near the end of a task passage, after any stat/flag changes,
  right before setting `$currentMapLocation` and linking back to the hub.
  `cost` is normally `1` - no task currently costs more than one unit.

- **`<<formatClock minutes>>`** - Prints a 12-hour clock string, e.g.
  `<<formatClock $gameMinutes>>` → `9:10 PM`. Used by the top bar's JS
  equivalent (`formatClockJS` in `main.js` - kept in sync manually,
  see §8 Gotcha #4) and available for any future in-fiction clock text.

- **`<<taskEntry label target cost doneVar lockedExpr hint>>`** - Renders
  one `<li>`. Three states:
  - `doneVar` truthy → `✓ label` (struck through via `.task-done` CSS).
  - `lockedExpr` truthy → `🔒 label (hint)` (via `.task-locked` CSS),
    not clickable.
  - Otherwise → a real `<<link label target>>` the player can click.

  **`lockedExpr` must be a backtick expression**, not a bare
  `(!$var)` - see §8 Gotcha #2. Example call:
  ``<<taskEntry "Call Chloe" "Day1_Evening_B" 1 $chloePhoneCall `!$chloeVisitedDay1` "(visit her first)">>``

- **`<<homeTasks>>` / `<<neighborhoodTasks>>` / `<<chloeTasks>>`** - One
  widget per location. Each is the **single source of truth** for what
  tasks exist at that location: a fixed, unconditional sequence of
  `<<taskEntry>>` calls. Both `<<locationTasks>>` (hub) and
  `<<dayPlanContent>>` (popup) call into these three widgets rather than
  duplicating the task list - **when a new task is added to a location,
  edit only its one `*Tasks` widget.**

  Earlier versions of these widgets wrapped the list in an "if every
  task here is done, print 'Nothing left to do here right now.' instead
  of the list" check. That was wrong: it hid completed tasks' ✓
  checkmarks entirely once *all* tasks at a location were done, which
  is invisible for any location with only one task (Chloe's Apartment:
  visiting her once immediately "finished" the whole location, so her
  task vanished instead of showing crossed-out like every other done
  task does). The list is now always rendered unconditionally - a
  done task simply shows `✓ label`, exactly like everywhere else, and a
  fully-completed location just ends up as a list of checkmarks rather
  than a synthetic empty-state message.

- **`<<locationTasks location>>`** - Hub-facing dispatcher: prints only
  the given location's task widget (no heading, since the hub already
  shows a location heading above it).

- **`<<lateWarning>>`** - See §3.

- **`<<dayPlanContent>>`** - Popup-facing (Objectives icon): prints
  **all** locations with headings, regardless of `$currentMapLocation`,
  by calling `<<homeTasks>>`/`<<neighborhoodTasks>>`/`<<chloeTasks>>`
  directly. This is what makes the Objectives popup a global overview
  instead of only showing the current location.

- **`<<locationMap location>>`** - Renders the inline SVG location
  graph (Home / Neighborhood / Chloe's Apartment / a locked "City" node
  reserved for future content), highlighting whichever location string
  is passed in, plus a one-line caption ("You are home." etc.). Used
  by the Map popup (see §7). The SVG's `viewBox` is `0 0 400 210` -
  if you add nodes, make sure their label `y` coordinates stay inside
  that box (a clipped "City" label was the actual bug that prompted
  widening it from `170` to `210`).

- **`<<statChange>>`, `<<addItem>>`, `<<hasItem>>`, `<<equipOutfit>>`,
  `<<statSummary>>`** - Unrelated to navigation; pre-existing stat/
  inventory widgets, unchanged by this system.

## 6. The hub - `game/hubs/DailyHub_Morning.twee` (passage name `DailyHub`)

(The file is still named `DailyHub_Morning.twee` for historical reasons
- it used to be one of three phase hubs. The **passage name** inside it
is `DailyHub`, which is what everything actually links to now. Consider
renaming the file itself if it's ever confusing.)

Render order, every time `DailyHub` is visited:

1. `<<startDay 9 3>>` - see §2/§5 (numbers are Day 1's task counts).
2. **Forced sleep check**: `$gameMinutes >= 1380`? If so, show the
   "I'm exhausted" screen and stop - no task list, no travel links, just
   a sleep link. If the player wasn't at Home when time ran out, a short
   bridging line narrates walking home first (and silently resets
   `$currentMapLocation` to `"home"`).
3. **First-visit intro**: `$gameMinutes is 420` (i.e., nothing has been
   done yet today) gates the "My alarm doesn't wake me..." opening
   paragraph so it only shows once, not on every return to the hub.
4. **Location view**: an `if/elseif` on `$currentMapLocation` picks the
   location image, heading, and one-line flavor text.
5. `<<lateWarning>>`.
6. `<<locationTasks $currentMapLocation>>` - the actual clickable task
   list for wherever the player is standing.
7. **Travel links**, also branched on `$currentMapLocation`: from Home
   you can walk to the Neighborhood or bus to Chloe's (plus "Head to bed
   early"); from Neighborhood or Chloe's, only "Head back home". Travel
   is free (no `<<spendTime>>` call) - it's just
   `<<set $currentMapLocation to "...">><<goto "DailyHub">>`.
8. If `$day isnot 1`, none of the above runs - instead a generic
   "hasn't been authored yet" placeholder shows, so the game degrades
   gracefully past the end of written content instead of erroring.

## 7. UI integration - `game/scripts/main.js`

Two existing systems were reused rather than rebuilt:

- **The icon strip + popup overlay** (`#right-icon-strip`,
  `#popup-overlay`/`#popup-body`) already existed for Phone/Location/
  Inventory/Clothes. Two cases were added to the same `switch` in the
  `.icon-button` click handler:
  - `"Objectives"` → sets a heading, then
    `Wikifier.wikifyEval("<<dayPlanContent>>")`.
  - `"Map"` → sets a heading, then
    ``Wikifier.wikifyEval('<<locationMap $currentMapLocation>>')``.

  **`Wikifier.wikifyEval()` returns a `DocumentFragment`, not a string**
  (see §8 Gotcha #4) - it's appended to `#popup-body` with jQuery
  `.append()` after the heading HTML is set with `.html()`, never
  string-concatenated.

- **The top bar** (`#top-bar`, injected once on `:storyready`) used to
  show `Day: N | Time: Morning` (the capitalized `$phase` word). It now
  shows `Day: N | 🕐 8:25 AM`. Because the top bar updates on every
  `:passagerender` (a lightweight, frequent event), it does **not** call
  into SugarCube's widget/Wikifier system - `formatClockJS()` in
  `main.js` is a small plain-JS duplicate of the `<<formatClock>>` widget
  logic. **If you ever change how the clock is formatted, update both.**

## 8. Task passage contract

Every task passage (`Day1_Morning_A`, `Day1_SQ_Ali`, etc.) follows the
same pattern at its end, after all narrative/stat-change content:

```
<<set $someDoneFlag to true>>      /* mark this task complete */
<<spendTime 1>>                     /* advance the clock */
<<set $currentMapLocation to "home">>  /* confirm where the player ends up */

<<link "Continue" "DailyHub">><</link>>
```

If a task has an Accept/Refuse (or similar) branch, **both** branches
must independently set the done flag, spend time, and set the location -
don't assume shared code runs after the branch.

If adding a task that should only unlock after another task, don't gate
it in the passage itself - gate it in that location's `*Tasks` widget via
`<<taskEntry>>`'s `lockedExpr` argument (backtick expression!). The
passage doesn't need to know it's locked; the hub simply won't offer a
link to it until the widget says otherwise.

## 9. Extending this for a new day

1. Count that day's main tasks and side tasks.
2. Add a new `<<if $day is N>>` branch to `DailyHub` mirroring Day 1's
   structure (or refactor into a per-day include if this grows past two
   or three days - right now everything is hardcoded to Day 1 for
   simplicity, per `<<if $day is 1>>` guards throughout `Widgets.twee`
   and `DailyHub`).
3. Call `<<startDay mainCount sideCount>>` with that day's counts.
4. Add per-day done-flags to `StoryInit.twee`.
5. Add/extend `*Tasks` widgets (either new ones for new locations, or
   more `<<taskEntry>>` lines in existing ones) and wire them into both
   `<<locationTasks>>` and `<<dayPlanContent>>`.
6. If a new location is introduced, add a node + edge to
   `<<locationMap>>`'s SVG and a branch to the hub's location-view
   `if/elseif` and travel-links `if/elseif`.

## 10. Hard-won SugarCube gotchas

These cost real debugging time and will bite again if forgotten:

1. **`<<link "text" "target">>` always needs an explicit
   `<</link>>`**, even in the two-argument "self-closing" form shown in
   most SugarCube tutorials. Omitting it doesn't just fail silently -
   the parser keeps scanning for a closing tag, swallows the next
   `<<link>>` call it finds as if it were the closing tag's content, and
   produces a cascading "malformed closing tag" error that can wipe out
   several choices' worth of markup in one passage.

2. **A bare parenthesized expression like `(!$var)` passed as a macro
   argument is *not* evaluated** - SugarCube takes it as a literal
   string (always truthy, since it's non-empty). Negations, arithmetic,
   or any computed argument must be wrapped in backticks:
   `` `!$var` ``, `` `_cost * $minutesPerTask` ``, etc. This is exactly
   what caused Ali/Delgado/Call-Chloe to stay permanently "locked" the
   first time the unlock conditions were written.

3. **Nesting `<<nobr>>` inside a widget that's itself called from an
   already-`<<nobr>>`-wrapped passage breaks the *outer* `<<nobr>>`**,
   leaking stray `<br>` tags into the surrounding content. Don't rely on
   `<<nobr>>` inside a widget at all if that widget might be called from
   inside another `<<nobr>>` block (which, in this codebase, is always -
   every day passage and the hub wrap their whole body in `<<nobr>>`).
   The reliable fix is to write the widget's entire body as **one
   physical line with zero embedded newlines** - that's why every
   widget in `Widgets.twee` looks like a wall of text instead of neatly
   indented multi-line code. Pure logic lines (`<<set>>`/`<<if>>` with no
   visible output) auto-trim their surrounding newlines regardless of
   `<<nobr>>`, but any line that produces real output (a `<span>`, a
   `<<link>>`, plain text) does not, and will show as unwanted vertical
   whitespace or extra `<br>`s once rendered.

4. **`Wikifier.wikifyEval(text)` returns a `DocumentFragment`, not an
   HTML string.** String-concatenating it produces the literal text
   `[object DocumentFragment]` in the DOM. Append it as a node instead
   (`$el.append(fragment)`), after setting any surrounding HTML with
   `.html()` first.

5. The **twee3-language-tools VS Code linter** (the source of the
   inline "Unrecognized macro/widget" and "Malformed container macro"
   diagnostics you'll see while editing) is a *separate, imperfect*
   static analyzer from the actual SugarCube runtime. It doesn't know
   about widgets defined elsewhere in the same file/project, so
   "Unrecognized macro/widget" warnings for things like `taskEntry`,
   `centerImage`, `dialog`, etc. are expected noise, not real errors.
   Its "Malformed container macro! Closing 'link' tag not found!" for
   `<<link>>`, however, has turned out to be **correct** every time it
   fired (see Gotcha #1) - trust that one, verify the rest against an
   actual compile + browser test.

## 11. File map

| File | Role |
|---|---|
| `game/init/StoryInit.twee` | All state variables, including the ones this system owns (§4). |
| `game/system/Widgets.twee` | Every widget this system uses (§5). |
| `game/hubs/DailyHub_Morning.twee` | The `DailyHub` passage - the actual navigation hub (§6). |
| `game/scripts/main.js` | Icon strip / popup wiring for Objectives + Map, and the top-bar clock (§7). |
| `game/styles/main.css` | `.day-plan`, `.task-*`, `.location-map`, `.map-*`, `.late-warning`, `.travel-links`, `.clock-display` (now largely superseded by the top bar, but still present/harmless) rules. |
| `game/days/day001/*.twee` | The actual task passages, each following the contract in §8. |
