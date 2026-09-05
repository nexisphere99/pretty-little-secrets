# Code Agent Prompt: Day 2 Integration into Pretty Little Secrets (Twine/SugarCube)

## Source Files
- `day2_main_quest.md` - Main story content (~10,000 words)
- `day2_side_quests_npcs.md` - Side quest/NPC content (~5,500 words)

## File Output Structure

```
src/days/day002/
├── Day2_Morning_A.tw              # Evelyn morning task (Yes Ma'am OR dishes)
├── Day2_Morning_B.tw              # Jog past Sophia's house
├── Day2_Morning_C.tw              # Sleep in
├── Day2_Afternoon_A.tw            # Visit Chloe (choice point)
├── Day2_Afternoon_A_Accept.tw     # Panties path: lip gloss + oral sex scene
├── Day2_Afternoon_A_Refuse.tw     # Refused path: softening approach
├── Day2_Afternoon_B.tw            # Explore town (Vanessa, Kinky Kitty, Mall)
├── Day2_Afternoon_C.tw            # Lily's room (nail painting dare)
├── Day2_Afternoon_C_Accept.tw     # Accept nail painting + photo
├── Day2_Afternoon_C_Refuse.tw     # Refuse nail painting
├── Day2_Evening_A.tw              # Evelyn dinner rules
├── Day2_Evening_B.tw              # Text Chloe goodnight
├── Day2_Evening_C.tw              # Lily's room round 2 (Instagram)
├── Day2_Night.tw                  # Night reflection (conditional)
├── Day2_SQ_Ali.tw                 # Ali crossword encounter
├── Day2_SQ_Henderson.tw           # Henderson recurring
├── Day2_SQ_Closet.tw              # Evelyn closet glimpse (optional)
└── Day2_SQ_WardrobeAudit.tw       # Wardrobe self-reflection
```

## Day 2 Specific Conversion Notes

### 1. Morning Option A Has Internal Branching Based on Day 1 Choices

The Evelyn morning scene changes depending on whether Alex helped her on Day 1:

```twee
:: Day2_Morning_A [day2 morning evelyn]
<<if $evelynChoresDay1>>
  /* Warm path: "Yes Ma'am" training (Stage 1, Moment 2) */

  Sunday mornings have a specific quality in this house...

  /* Full narrative for Yes Ma'am scene */

  <<link "Accept: 'Yes... Ma'am'" "Day2_Morning_A_YesMaam">>
    <<statChange "obedience" 3>>
    <<statChange "feminization" 1>>
    <<set $evelynRelationship += 3>>
    <<set $yesMaamAccepted to true>>
  <</link>>

  <<link "Mumble something noncommittal" "Day2_Morning_A_Decline">>
    <<statChange "resistance" 2>>
    <<set $evelynRelationship += 1>>
  <</link>>

<<else>>
  /* Cold path: dishes only */

  The kitchen is a battlefield of last night's dinner...

  <<statChange "obedience" 1>>
  <<set $evelynRelationship += 1>>

  <<link "Continue to afternoon" "DailyHub_Afternoon">><</link>>
<</if>>
```

### 2. Afternoon Option A Has Major Branching Based on Panty Status

This is the most complex passage for Day 2. The entire Chloe visit branches on `$pantiesAccepted`:

```twee
:: Day2_Afternoon_A [day2 afternoon chloe]
<<if $pantiesAccepted>>
  /* PANTIES PATH: Lip gloss + oral sex scene */
  The bus ride is different today...

  /* Narrative through lip gloss application */

  <<statChange "feminization" 3>>
  <<statChange "arousal" 2>>
  <<statChange "obedience" 1>>
  <<set $chloeRelationship += 3>>
  <<set $lipGlossApplied to true>>

  /* Sex scene choice point */
  <<link "When she says 'On your knees,' obey" "Day2_Chloe_OralSex">>
  <</link>>
  <<link "Kiss her but redirect to the movie" "Day2_Chloe_NoSex">>
    <<statChange "resistance" 2>>
  <</link>>

<<else>>
  /* REFUSED PATH: Softening approach */
  Chloe is different today. Softer...

  <<statChange "arousal" 2>>
  <<set $chloeRelationship += 2>>

  <<link "Continue to evening" "DailyHub_Evening">><</link>>
<</if>>
```

Sex scene in separate passage:

```twee
:: Day2_Chloe_OralSex [day2 chloe sex]
She lies back on the bed. Spreads her legs...

/* Full oral sex scene narrative - DO NOT truncate */
/* Include: glossy lips detail, panties-on detail, denial at end */
/* This scene establishes the pattern: service Chloe + denial for Alex */

<<statChange "arousal" 3>>
<<statChange "obedience" 2>>
<<statChange "feminization" 2>>
<<set $chloeRelationship += 3>>
<<set $chloeOralDay2 to true>>
<<set $deniedOrgasm += 1>>

<<link "Leave Chloe's apartment" "DailyHub_Evening">><</link>>
```

### 3. Afternoon Option C: Lily's Nail Painting Has Photo Consequences

```twee
:: Day2_Afternoon_C_Accept [day2 afternoon lily nails]
"Fine. Whatever."

She moves faster than I expect...

/* Full nail painting scene */

<<statChange "feminization" 3>>
<<statChange "embarrassment" 2>>
<<set $lilyRelationship += 3>>
<<set $lilyPhotoCount to ($lilyPhotoCount || 0) + 1>>
<<set $lilyHasNailPhoto to true>>
<<set $toenailsPainted to true>>
<<set $toenailColor to "black">>

/* Photo taken - this is tracked for blackmail arc */
<<if !$lilyBlackmailPhotos>>
  <<set $lilyBlackmailPhotos to []>>
<</if>>
<<run $lilyBlackmailPhotos.push({day: 2, type: "toenails", color: "black"})>>

<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

### 4. Evening Option C: Lily's @prettyboykai Introduction

This passage plants the online persona seed. No choices needed, but track the exposure:

```twee
:: Day2_Evening_C [day2 evening lily instagram]
<<if $toenailsPainted>>
  /* Lily shows @prettyboykai account */

  "Psst. Alex."...

  /* Full narrative - Lily showing Instagram account */
  /* "You've got the face for it" dialogue */

  <<statChange "feminization" 1>>
  <<statChange "embarrassment" 1>>
  <<set $lilyRelationship += 2>>
  <<set $prettyboyKaiSeen to true>>
  /* This flag enables Lily's Day 14 "Lexi" account creation dialogue */

  <<link "Go back to your room" "Day2_Night">><</link>>
<<else>>
  /* If nails weren't painted, this scene doesn't trigger */
  /* Lily's room option only available if prior interaction happened */
  <<goto "DailyHub_Evening">>
<</if>>
```

### 5. Night Reflection: Multiple Conditional Layers

Day 2's night reflection must account for all possible combinations:

```twee
:: Day2_Night [day2 night reflection]
<h2>Night</h2>

Midnight. The house settles around me...

<<if $lipGlossApplied or $toenailsPainted or $yesMaamAccepted>>
  /* HEAVY REFLECTION - lots happened */

  The day plays back in fragments.

  <<if $lipGlossApplied>>
    The taste of vanilla gloss...
  <</if>>

  <<if $yesMaamAccepted>>
    Evelyn's hand adjusting my collar...
  <</if>>

  <<if $toenailsPainted>>
    The cold wet kiss of black nail polish...
  <</if>>

  <<if $chloeOralDay2>>
    Chloe's thighs around my head, her fingers in my hair...
    <<if $pantiesEquipped>>
      The panties shift against my skin when I roll over...
    <</if>>
  <</if>>

  Something is happening to me.

<<else>>
  /* LIGHT REFLECTION - quiet day */

  I think about Chloe. About her smile...
  I tell myself tomorrow will be normal too.
<</if>>

/* Stat display */
<div class="stat-summary">
  <<include "StatDisplay">>
</div>

/* Tara Instagram foreshadowing (random chance) */
<<if visited("Day2_Afternoon_B") and random(1,3) is 1>>
  /* Show Tara's Instagram story as pre-sleep scrolling */
  Scrolling Instagram in bed, I pass a story from @tara_marie_xo...
  <<set $taraStorySeenDay2 to true>>
<</if>>

/* Day advancement */
<<set $day += 1>>
<<set $phase to "morning">>
<<checkUnlocks>>

<<link "Sleep — Begin Day $day" "DailyHub_Morning">><</link>>
```

### 6. Hub Passage Update for Day 2

```twee
:: DailyHub_Morning [hub]
<<if $day is 2>>
  <h2>Morning — Day 2</h2>

  <div class="day-objectives">
    <strong>Today's Objectives:</strong>
    <ul>
      <li>Deepen your relationship with one core character</li>
      <li>Explore a new area of the neighborhood or town</li>
      <li>Optional: Meet the neighbor / Visit Lily's room</li>
    </ul>
  </div>

  <<if $pantiesEquipped>>
    Morning light through the curtains. I pull on my jeans and feel the lace adjust
    around my hips. I should change into boxers. I grab a pair from my drawer.
    Hold them. Put them back.
  <<else>>
    Morning. Another day. Evelyn's downstairs, Lily's door is closed.
  <</if>>

  <<link "Help Evelyn with her morning task" "Day2_Morning_A">><</link>>
  <<link "Go for a jog (pass Sophia's house)" "Day2_Morning_B">><</link>>
  <<link "Sleep in" "Day2_Morning_C">><</link>>

/* Afternoon hub */
<<elseif $day is 2 and $phase is "afternoon">>
  <h2>Afternoon — Day 2</h2>

  <<link "Visit Chloe's apartment" "Day2_Afternoon_A">><</link>>
  <<link "Explore town (cafe, shops, mall)" "Day2_Afternoon_B">><</link>>
  <<link "Hang out in Lily's room" "Day2_Afternoon_C">><</link>>

/* Evening hub */
<<elseif $day is 2 and $phase is "evening">>
  <h2>Evening — Day 2</h2>

  <<link "Dinner with Evelyn and Lily" "Day2_Evening_A">><</link>>
  <<link "Text Chloe goodnight" "Day2_Evening_B">><</link>>
  <<if $toenailsPainted or $lilyRelationship >= 7>>
    <<link "Lily's room, round two" "Day2_Evening_C">><</link>>
  <</if>>

<</if>>
```

### 7. Side Quest Integration Points

Side quest NPCs are integrated as **embedded encounters within main passages**, not standalone scenes on Day 2:

| NPC | Appears In | Integration Method |
|---|---|---|
| Henderson | Any outgoing passage | Embedded 2-paragraph snippet at start |
| Ali | Day2_Afternoon_B | Embedded store visit within town exploration |
| Vanessa | Day2_Afternoon_B | Embedded window observation within town exploration |
| Nicolette | Day2_Afternoon_B | Embedded mall observation within town exploration |
| Tara (Instagram) | Day2_Night | Random chance social media scrolling |

Exception: Ali's crossword and the Evelyn closet glimpse can be standalone side-passages accessible from within main passages:

```twee
:: Day2_SQ_Ali [day2 sidequest neighborhood]
/* Accessible from Day2_Afternoon_B via embedded link */
<<if !$aliCrosswordDay2>>
  Ali is doing his crossword when I walk in...

  /* Full Ali scene with "reshape" clue */

  <<set $aliFamiliarity += 2>>
  <<set $aliCrosswordDay2 to true>>
  <<set $aliCrosswordClue to "reshape">>
<</if>>
<<link "Continue exploring" "Day2_Afternoon_B_Continue">><</link>>
```

### 8. Conditional Variables Introduced on Day 2

```javascript
// New flags set on Day 2
$yesMaamAccepted          // Evelyn's polite address training accepted
$lipGlossApplied          // Chloe applied lip gloss to Alex
$chloeOralDay2            // Oral sex scene with Chloe occurred
$deniedOrgasm             // Counter: how many times Alex was denied release
$toenailsPainted          // Lily painted Alex's toenails
$toenailColor             // "black" (Day 2) or "pink" (Day 4 retry)
$lilyHasNailPhoto         // Lily took a photo of painted toenails
$lilyBlackmailPhotos      // Array of photo objects for blackmail tracking
$lilyPhotoCount           // Running count of Lily's photos of Alex
$prettyboyKaiSeen         // Alex saw the @prettyboykai Instagram account
$sophiaMet                // Sophia properly introduced herself
$yogaStudioFlag           // Yoga studio flyer received
$taraStorySeenDay2        // Tara's Instagram story seen (BBC foreshadowing)
$aliCrosswordDay2         // Ali crossword encounter occurred
$aliCrosswordClue         // Current crossword answer for Easter egg tracking
$nicoletteSpotted         // Nicolette seen through salon window
$vanessaSpotted           // Vanessa seen through cafe window
$kinkyKittyNoticed        // Kinky Kitty shop exterior observed
$ridingCropSeen           // Alex noticed riding crop in Evelyn's closet
$wardrobeAuditDone        // Alex reflected on his limited wardrobe
```

### 9. Content Toggle Gates for Day 2

Day 2 has minimal toggle-gated content. The only BBC-related content is the blurred figure in Tara's Instagram story:

```twee
/* In Day2_Night, Tara Instagram section */
<<if $bbcEnabled>>
  I tap to the next story. A group shot. Tara and three other women and,
  in the background, blurred by movement, a tall Black man in a fitted shirt.
  He's out of focus but even blurred you can tell he's big...
  <<set $bbcAtmospheric += 1>>
<<else>>
  I tap to the next story. A group shot. Tara and her friends at a club...
<</if>>
```

No NTR, forced bi, or extreme content on Day 2. These arcs haven't started yet.

### 10. Sex Scene Technical Notes

Day 2 has ONE sex scene: `Day2_Chloe_OralSex`

Requirements:
- Only accessible if `$pantiesAccepted is true` (Day 1 choice)
- Player must choose to obey (not auto-play)
- Scene includes: lip gloss detail, panties-worn detail, orgasm denial
- Alex services Chloe; Alex does NOT orgasm
- `$deniedOrgasm` counter increments (tracks cumulative denial for arousal buildup)
- Scene text must not be truncated or summarized. Full prose from the MD file.

### 11. Cross-Day Continuity Checks

Before finalizing Day 2 passages, verify these Day 1 → Day 2 connections:

- [ ] `$pantiesAccepted` gates the Chloe afternoon branch correctly
- [ ] `$pantiesEquipped` modifies the morning hub text (putting on jeans)
- [ ] `$evelynChoresDay1` gates the Evelyn morning warm/cold branch
- [ ] `$pantiesEquipped` modifies Henderson sidewalk encounter (internal awareness)
- [ ] `$cafeJobApplied` (Day 1 Afternoon C) enables interview reference in town exploration
- [ ] Sophia pre-introduction flags from Day 1 jogging carry into Day 2 meeting bonus
- [ ] Lily awareness flag from Day 1 dinner carries into Day 2 afternoon interaction

### 12. Multi-Activity Per Time Slot Note

The user's request specifies that within a single time slot, Alex can do a few things (not just one option). To implement this while keeping the branching manageable:

**Approach**: The primary choice determines the main passage. Within that passage, embed 1-2 optional side encounters as inline links:

```twee
:: Day2_Afternoon_B [day2 afternoon explore]
/* Main: Town exploration */

Downtown is a fifteen-minute walk...

/* Cafe observation - embedded */
Lush Latte is the first thing I see...

/* Optional Ali encounter - linked */
<<link "Stop at Ali's corner store on the way" "Day2_SQ_Ali">><</link>>

/* Kinky Kitty observation - embedded */
Further down the strip...

/* Mall/Nicolette observation - embedded */
At the end of the strip, Crystal Haven Mall...

<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

This lets the player experience the main activity plus optional side encounters without needing a separate time slot. The "one activity per slot" is the main quest choice; side encounters are bonuses within that choice.
