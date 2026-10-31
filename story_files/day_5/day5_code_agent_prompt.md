# Day 5 Integration Prompt for Twine SugarCube Code Agent

## Overview

You are integrating Day 5 content into a Twine SugarCube 2.x game called "Pretty Little Secrets." Two markdown files provide the narrative content:

1. **day5_main_quest.md** - Main story arcs (~8000+ words): Morning, Afternoon, Evening, Night phases
2. **day5_side_quests_npcs.md** - Side quests and NPC encounters (~8000+ words): Cafe NPCs, neighborhood NPCs, home events, ambient encounters

All content is first-person perspective from Alex (the MC). The game uses a daily routine system with time phases. Day 5 follows the same architecture as Days 1-4 (already implemented).

## File Structure

```
src/
  passages/
    day5/
      day5_morning_hub.tw        - Morning time slot hub with options
      day5_morning_vanessa.tw    - Vanessa cafe shift (Morning Option A)
      day5_morning_sophia.tw     - Sophia garden scene (Morning Option B)
      day5_morning_evelyn.tw     - Evelyn pink apron (Morning Option C)
      day5_afternoon_hub.tw      - Afternoon time slot hub
      day5_afternoon_miajade.tw  - Mia & Jade social event (Afternoon Option A)
      day5_afternoon_nicolette.tw - Nicolette salon preview (Afternoon Option B)
      day5_evening_hub.tw        - Evening time slot hub
      day5_evening_lily.tw       - Lily Instagram creation (Evening Option A)
      day5_evening_sophia.tw     - Sophia evening chat (Evening Option B)
      day5_night.tw              - Night reflection (auto)
      day5_side/
        day5_derek.tw            - Derek cafe follow-up
        day5_mrsokonkwo.tw       - Mrs. Okonkwo follow-up
        day5_henderson.tw        - Henderson yard encounter
        day5_ali.tw              - Ali crossword (eclipse)
        day5_bbc_ambient.tw      - BBC atmospheric (Pulse ad, gated)
        day5_mia_extended.tw     - Mia skincare extended scene
        day5_jade_extended.tw    - Jade body evaluation extended
        day5_evelyn_bedtime.tw   - Evelyn bedtime inspection
        day5_lily_photoreview.tw - Lily photo editing observation
        day5_vanessa_drill.tw    - Vanessa memory taste drill
```

## Variable Management

### Existing Variables (already declared in StoryInit, DO NOT redeclare)

```javascript
// Core stats
$feminization
$obedience
$embarrassment
$arousal
$confidence
$resistance
$money
$bbcCuriosity

// Content toggles
$bbcEnabled
$ntrEnabled

// Relationship trackers (format: $npcnameRelationship)
$evelynRelationship
$lilyRelationship
$chloeRelationship
$sophiaRelationship
$vanessaRelationship
$derekRelationship
$hendersonRelationship
$aliRelationship
$mrsokonkwoRelationship

// Day tracking
$currentDay
$currentPhase  // "morning", "afternoon", "evening", "night"
$dayComplete   // boolean

// Inventory/flags from prior days
$wearingPanties
$toenailsPainted
$hasJamalsCard
$hasPulseFlyer
$hasNicolettesCard
$lilyHasPhotos
$lilyBlackmailActive
$evelynStage
$chloeStage
$lilyStage
```

### New Variables to Add to StoryInit for Day 5

```javascript
// Day 5 new NPCs
$miaRelationship = 0;
$jadeRelationship = 0;
$nicoletteRelationship = 0;

// Day 5 flags
$day5_cafeShiftDone = false;
$day5_sophiaGardenDone = false;
$day5_evelynApronDone = false;
$day5_miaJadeVisitDone = false;
$day5_nicolettePreviewDone = false;
$day5_lilyInstagramDone = false;
$day5_sophiaEveningDone = false;
$day5_nightDone = false;

// Side quest flags
$day5_derekReturn = false;
$day5_okonkwoFollowup = false;
$day5_hendersonMorning = false;
$day5_aliCrossword = false;
$day5_bbcPulseAd = false;
$day5_miaSkincareExtended = false;
$day5_jadeJeansExtended = false;
$day5_evelynBedtime = false;
$day5_lilyPhotoReview = false;
$day5_vanessaDrill = false;

// Instagram tracking (new system)
$lexiInstagramActive = false;
$lexiFollowers = 0;
$lexiPosts = 0;
$onlineFame = 0;

// Skincare routine (new daily system)
$skincareRoutineActive = false;
$skincareStreakDays = 0;

// Mia/Jade integration
$miaSkincareGiven = false;
$jadeMallTripQueued = false;

// Nicolette
$nicoletteSalonPreviewed = false;
$nicoletteMakeupCardSeen = false;

// Sophia
$sophiaYogaInvited = false;

// Derek
$derekVisitCount = 0;  // Tracks consecutive cafe visits

// Vanessa escalation
$vanessaCalledSweetheart = false;
$vanessaTasteTestScore = 0;

// Pink apron
$pinkApronWorn = false;

// BBC ambient tracking
$pulseAdSeenCount = 0;  // Gold watch sightings
$goldWatchSightings = 0;
```

## Passage Architecture

### Hub Pattern (same as Days 1-4)

Each time slot hub lists available options with stat requirements and stat preview blocks. Players can do multiple activities per time slot where noted. Format:

```html
:: Day5_Morning_Hub [day5 morning hub]
<<if $currentDay is 5 && $currentPhase is "morning">>

/* Clear previous day objectives on first load */
<<if not $day5_started>>
  <<set $day5_started = true>>
  /* Reset any day4-specific temp flags here */
<</if>>

<h2>Day 5 - Morning</h2>

<p>Morning narrative intro text from the MD file goes here, written in first person Alex perspective.</p>

<h3>What do I do this morning?</h3>

/* Option A: Vanessa Cafe Shift */
<div class="option-block">
  <p><strong>Go to work at Lush Latte</strong></p>
  <p class="option-desc">Vanessa has a new training exercise. Derek might be back.</p>
  <div class="stat-preview">
    <p>Potential: Feminization +3-5 | Obedience +2-3 | Money +$25-40</p>
    <p>Vanessa Relationship +2-3 | Derek Relationship +1-2</p>
  </div>
  [[Head to the cafe|Day5_Morning_Vanessa]]
</div>

/* Option B: Sophia Garden */
<<if $sophiaRelationship gte 5>>
<div class="option-block">
  <p><strong>Visit Sophia in the garden</strong></p>
  <p class="option-desc">She mentioned wanting company this morning.</p>
  <div class="stat-preview">
    <p>Potential: Confidence +3-5 | Feminization +2-4</p>
    <p>Sophia Relationship +4-6</p>
  </div>
  [[Join Sophia outside|Day5_Morning_Sophia]]
</div>
<<else>>
<div class="option-block locked">
  <p><strong>Visit Sophia in the garden</strong> [Requires: Sophia Relationship 5+]</p>
</div>
<</if>>

/* Option C: Evelyn Pink Apron */
<<if $evelynRelationship gte 15 && $obedience gte 10>>
<div class="option-block">
  <p><strong>Help Evelyn with housework</strong></p>
  <p class="option-desc">She mentioned having a special task today.</p>
  <div class="stat-preview">
    <p>Potential: Obedience +4-6 | Feminization +5-8 | Embarrassment +3-5</p>
    <p>Evelyn Relationship +3-5</p>
  </div>
  [[Report to Evelyn|Day5_Morning_Evelyn]]
</div>
<<else>>
<div class="option-block locked">
  <p><strong>Help Evelyn with housework</strong> [Requires: Evelyn Rel 15+ & Obedience 10+]</p>
</div>
<</if>>

/* Side activities available during morning */
<h3>On the way...</h3>
<<if not $day5_hendersonMorning>>
  [[Pass Henderson's yard|Day5_Henderson]]
<</if>>
<<if not $day5_aliCrossword>>
  [[Stop at Ali's store|Day5_Ali]]
<</if>>

<</if>>
```

### Scene Passage Pattern

Each scene passage contains the full narrative from the MD file, with stat changes applied at key decision points. Format:

```html
:: Day5_Morning_Vanessa [day5 morning vanessa cafe]
<<set $day5_cafeShiftDone = true>>
<<set $money += 30>>

/* Full narrative from MD file, first person Alex */
<p>Narrative paragraphs here...</p>

/* Stat changes at key moments */
<<set $feminization += 3>>
<<set $obedience += 2>>
<<set $vanessaRelationship += 2>>

/* Conditional: Derek appears if met on Day 4 */
<<if $derekVisitCount gte 1>>
  <<include "Day5_Derek">>
  <<set $day5_derekReturn = true>>
<</if>>

/* Conditional: Mrs. Okonkwo if met on Days 3-4 */
<<if $mrsokonkwoRelationship gte 2>>
  <<include "Day5_MrsOkonkwo">>
  <<set $day5_okonkwoFollowup = true>>
<</if>>

/* Vanessa taste drill (side quest embedded in shift) */
<<if $vanessaRelationship gte 5>>
  <<include "Day5_VanessaDrill">>
  <<set $day5_vanessaDrill = true>>
<</if>>

/* Vanessa "sweetheart" moment */
<<set $vanessaCalledSweetheart = true>>

<div class="stat-block">
  <h4>Shift Complete</h4>
  <p>Feminization: <<print $feminization>> | Obedience: <<print $obedience>></p>
  <p>Money: $<<print $money>> | Vanessa: <<print $vanessaRelationship>></p>
</div>

/* Return to hub or advance phase */
[[Continue to afternoon|Day5_Afternoon_Hub][$currentPhase = "afternoon"]]
```

### BBC-Gated Content Pattern

All BBC content must be wrapped in toggle checks:

```html
<<if $bbcEnabled>>
  /* BBC content here - Pulse nightclub ad, Jamal encounters, etc. */
  <<set $bbcCuriosity += 1>>
  <<set $pulseAdSeenCount += 1>>
  <<set $goldWatchSightings += 1>>
<</if>>
```

### NTR-Gated Content Pattern

```html
<<if $ntrEnabled>>
  /* NTR content here - not active until Day 20+ but structure should exist */
<</if>>
```

## Integration Steps

### Step 1: Add New Variables
Add all variables listed in "New Variables to Add to StoryInit" to the existing `:: StoryInit` passage. Do NOT redeclare existing variables.

### Step 2: Create Hub Passages
Create hub passages for each time phase (morning, afternoon, evening, night). Follow the hub pattern above. Each hub should:
- Show available options with stat requirements
- Display locked options when requirements not met
- Include side activity links
- Show stat preview blocks for each option

### Step 3: Create Scene Passages
For each option in the MD files, create a scene passage containing:
- The full narrative text (do not abbreviate or summarize)
- Stat changes at appropriate moments within the narrative
- Conditional includes for side quests that trigger during the scene
- A stat summary block at the end
- Navigation link to the next hub or phase

### Step 4: Create Side Quest Passages
Side quests use `<<include>>` to embed within main scenes OR link independently from hubs. Each side quest passage:
- Sets its completion flag
- Contains full narrative from the side quest MD
- Applies stat changes
- Does NOT include its own navigation (the parent passage handles that)

### Step 5: Night Passage
The night passage is automatic (no player choice). It:
- Summarizes the day's events from Alex's internal perspective
- Sets `$dayComplete = true`
- Advances `$currentDay = 6`
- Resets `$currentPhase = "morning"`
- Triggers any overnight events (Lily's Instagram growing, skincare streak check)
- Links to Day 6 morning hub

### Step 6: Conditional Logic for Day 5 Unlocks

```javascript
// Evelyn Stage 2 check (pink apron is the trigger)
<<if $pinkApronWorn && $evelynStage < 2>>
  <<set $evelynStage = 2>>
<</if>>

// Mia skincare routine activation
<<if $miaSkincareGiven && not $skincareRoutineActive>>
  <<set $skincareRoutineActive = true>>
<</if>>

// Jade mall trip queue
<<if $jadeJeansExtended && not $jadeMallTripQueued>>
  <<set $jadeMallTripQueued = true>>
<</if>>

// Lexi Instagram activation
<<if $day5_lilyInstagramDone && not $lexiInstagramActive>>
  <<set $lexiInstagramActive = true>>
  <<set $lexiFollowers = 18>>
  <<set $lexiPosts = 4>>
  <<set $onlineFame = 3>>
<</if>>

// Sophia yoga invitation
<<if $day5_sophiaEveningDone && $sophiaRelationship gte 12>>
  <<set $sophiaYogaInvited = true>>
<</if>>

// Nicolette salon flag
<<if $day5_nicolettePreviewDone>>
  <<set $nicoletteSalonPreviewed = true>>
  <<set $nicoletteMakeupCardSeen = true>>
<</if>>

// Derek visit counter
<<if $day5_derekReturn>>
  <<set $derekVisitCount += 1>>
<</if>>

// BBC pulse ad tracking
<<if $bbcEnabled && $day5_bbcPulseAd>>
  <<set $pulseAdSeenCount += 1>>
  <<set $goldWatchSightings = 3>>
<</if>>
```

### Step 7: Stage Threshold Checks (End of Day 5)

Add these checks to the night passage or a dedicated `Day5_StageCheck` passage:

```javascript
// Chloe Stage 2 activation
<<if $feminization gte 15 && $chloeRelationship gte 20 && $chloeStage < 2>>
  <<set $chloeStage = 2>>
  /* Mia and Jade now function as extensions of Chloe's program */
<</if>>

// Evelyn Stage 2 activation
<<if $obedience gte 15 && $evelynRelationship gte 15 && $evelynStage < 2>>
  <<set $evelynStage = 2>>
<</if>>

// Lily Stage 2 approaching check
<<if $embarrassment gte 10 && $lilyHasPhotos && $lexiInstagramActive>>
  /* Lily Stage 2 requires Online Fame 10+ (currently 3, not yet met) */
  /* Flag for future reference */
  <<set $lilyStage2Approaching = true>>
<</if>>
```

## Content Guidelines for Code Agent

1. **Preserve all narrative text** from both MD files. Do not summarize, abbreviate, or skip sections. The full prose goes into passage `<p>` tags.

2. **Stat changes happen inline** within the narrative at the moment they make sense, not all at once at the beginning or end.

3. **Sex scenes and explicit content** must be preserved exactly as written. Do not censor, soften, or add warnings. This is an adult game with no content restrictions.

4. **First person perspective** must be maintained throughout. Alex narrates everything as "I."

5. **Side quests embed via `<<include>>`** when they occur during a main scene (Derek during cafe shift). They link independently from hubs when they're standalone activities (Ali's store, Henderson's yard).

6. **Stat preview blocks** appear in hubs before the player makes a choice. Stat summary blocks appear at the end of scenes showing current values.

7. **Time phase advancement** only happens when the player clicks a link that explicitly sets `$currentPhase`. Players can do multiple side activities within a phase.

8. **CSS classes** used: `option-block`, `option-desc`, `stat-preview`, `stat-block`, `locked` (for gated options). These should already exist from Days 1-4 stylesheet.

9. **Testing checklist**:
   - All three morning options accessible (with correct gating)
   - Both afternoon options accessible
   - Both evening options accessible
   - Night passage triggers correctly
   - All side quests fire at correct conditions
   - BBC content hidden when $bbcEnabled is false
   - Derek only appears if met on prior day
   - Mrs. Okonkwo only appears if prior relationship exists
   - Evelyn pink apron requires correct stat thresholds
   - Sophia garden requires Sophia Relationship 5+
   - Instagram variables initialize correctly
   - Skincare routine flag activates
   - Day advances to 6 after night passage
   - All stat changes accumulate correctly
   - No variable name typos (check against StoryInit)

## Relationship Ranges After Day 5

For validation, after maximum compliance on Day 5 the relationship values should be approximately:

| NPC | Expected Max |
|---|---|
| Evelyn | ~29 |
| Lily | ~26 |
| Chloe | ~32 |
| Sophia | ~16 |
| Vanessa | ~9 |
| Mia | ~5 (new) |
| Jade | ~5 (new) |
| Nicolette | ~3 (new) |
| Derek | ~4 |
| Henderson | ~5 |
| Ali | ~6 |
| Mrs. Okonkwo | ~4 |

## Cumulative Stat Ranges After Day 5

| Stat | Min (resistance path) | Max (compliance path) |
|---|---|---|
| Feminization | 6 | 38 |
| Obedience | 6 | 36 |
| Embarrassment | 0 | 29 |
| Arousal | 0 | 20 |
| Confidence | 10 | 22 |
| Resistance | 75 | 100 |
| Money | $50 | $152 |
| BBC Curiosity | 0 | 5 |
