# Pretty Little Secrets — Dev Log

## 0.0.1
- Rebuilt Day 1 from scratch; removed all old Twine content, kept styles/images/JS.
- Replaced the locked Morning/Afternoon/Evening phase structure with free-roam navigation.
- Added a time-budget formula: main tasks + half of side tasks, spread across a 7AM–11PM clock.
- Sleep is always available (even early); forced sleep only once the budget is exhausted.
- Added a soft "getting late" warning near the end of the day instead of a hard cutoff.
- Added an always-visible Objectives popup listing every task (done/locked/available), side quests included.
- Added a Map popup showing the location graph with an active-location highlight.
- Moved the clock into the top bar, replacing the old "Time: Morning" text.
- Removed per-task duration hints like "(~1h 25m)" from the task list display.
- Fixed a bug where visiting Chloe made her task vanish instead of showing a checkmark.
- Wrote `navigation_and_objectives_system.md` documenting the whole system for future reference.

## 0.0.2
- Added Day 2 content (main quest + side quests/NPCs), through Day 2 sleep.
- Introduced Downtown as a new location — teased locked on Day 1, unlocked from Day 2 on.
- Extended the per-location task widgets to branch per day so each day can have its own task list.
- Added the Chloe mid-task choice pattern (obey vs. redirect), each branch completing its own contract.
- Added Day 2 state flags: lip gloss, oral sex scene, denied-orgasm counter, toenail color/photos, etc.
- Changed content-preference checkboxes to a vertical list and added a "Select All" checkbox.
- Fixed the Select-All sync bug by writing directly to checkbox DOM state instead of reloading the passage.
- Added new characters to the Characters popup: Sophia, Mr. Henderson, Ali, Mrs. Delgado, Claire, Theo.
- Generalized the "task done" fix from 0.0.1 so any single-task location shows a checkmark, not an empty state.
- Documented several hard-won SugarCube gotchas (nobr nesting, unevaluated bare expressions, link tags).

## 0.0.3
- Added Day 3 content (cafe job, Evelyn's closet, Lily's photography, Chloe's park picnic, Kinky Kitty, mall).
- Added the BBC-gated Marcus delivery scene, embedded inline behind the content toggle.
- Added a purse-carrying choice point at the park, with Mrs. Delgado reacting differently per branch.
- Added `$ravenRelationship`, a variable that was missing from init and had been causing a real bug.
- Discovered a major bug: SugarCube never evaluates macros/variables inside `<svg>`, so the map's
  active-location highlight had silently never worked since Day 1.
- Fixed it by precomputing every conditional value and emitting the whole SVG as one resolved string.
- Redesigned the map layout (Home/Neighborhood/Downtown in a line, Chloe's a pure branch off Home)
  to remove a visual ambiguity that looked like travel to Chloe's passed through the Neighborhood.
- Added decorative Cafe/Kinky Kitty/Mall sub-nodes under Downtown, shown from Day 3 on.
- Renamed the visible "Town" label to "Downtown" everywhere (kept the internal `"town"` id unchanged).
- Added the "version complete, support my Patreon" message shown once the player runs out of written days.

## 0.0.4
- Added Day 4 content (main quest + side quests/NPCs), through Day 4 sleep.
- Added Evelyn's heel-polishing and tea-tray-carrying tasks (tray locked until heels are done).
- Added the sleep-in task, which branches into Lily catching Alex in panties when conditions are met.
- Added Lily's hair-clip blackmail choice (agree and take the clip, or refuse and counter-threaten).
- Added Chloe's toenail-painting scene with a player choice into a sex scene (Chloe's first "good girl")
  or a no-sex redirect (stay and watch a movie).
- Added the cafe shift's Vanessa hip-sway lesson, the Derek customer encounter, and an Okonkwo follow-up.
- Added a downtown free-roam walk: Sophia's yoga window, the Zara/Pulse nightclub flyer, and a
  BBC-gated Jamal pre-intro.
- Added Ali's "makeover" crossword and Mr. Henderson's "walks like your mother" side quests.
- Added Lily's "Project L" corkboard observation and a quiet-night-in side quest.
- Added a BBC-gated Pulse Instagram ad and a randomized Evelyn-finds-the-panties laundry event at night.
- Updated the Patreon link to zaramystique_pls.
