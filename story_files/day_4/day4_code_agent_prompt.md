# Code Agent Prompt: Day 4 Integration into Pretty Little Secrets (Twine/SugarCube)

## Source Files
- `day4_main_quest.md` - Main story (~12,000 words)
- `day4_side_quests_npcs.md` - Side quest/NPC content (~7,000 words)

## File Output Structure

```
src/days/day004/
├── Day4_Morning_A.tw              # Cafe shift (Vanessa hip sway + butt tap)
├── Day4_Morning_B.tw              # Evelyn heel polishing
├── Day4_Morning_C.tw              # Sleep in, Lily catches panties
├── Day4_Afternoon_A.tw            # Chloe toenail painting + choice
├── Day4_Afternoon_A_Sex.tw        # Oral sex scene (denial)
├── Day4_Afternoon_A_NoSex.tw      # Skip sex, continue to evening
├── Day4_Afternoon_B.tw            # Free roam downtown (Jamal, Zara, Sophia)
├── Day4_Afternoon_C.tw            # Evelyn tray carrying lesson
├── Day4_Evening_A.tw              # Lily blackmail (choice: agree/refuse)
├── Day4_Evening_A_Agree.tw        # Accept hair clip deal
├── Day4_Evening_A_Refuse.tw       # Refuse, counter-threaten
├── Day4_Evening_B.tw              # BBC ambient: Pulse Instagram ad (toggle)
├── Day4_Evening_C.tw              # Quiet night (rest/resistance)
├── Day4_Night.tw                  # Night reflection
├── Day4_SQ_Derek.tw               # Derek winking customer
├── Day4_SQ_Okonkwo2.tw            # Mrs. Okonkwo follow-up
├── Day4_SQ_Jamal.tw               # Jamal pre-intro (BBC-gated)
├── Day4_SQ_Zara.tw                # Zara pre-intro at Pulse
├── Day4_SQ_Ali.tw                 # Ali crossword "makeover"
├── Day4_SQ_LaundryEvent.tw        # Evelyn finds panties (random)
├── Day4_SQ_ProjectL.tw            # Lily's corkboard observation
└── Day4_SQ_Henderson.tw           # Henderson "walks like mother"
```

## Day 4 Specific Conversion Notes

### 1. Morning Option C: Lily Panty Discovery is the Biggest Flag Day

This is the most consequential scene so far. It sets Lily's entire blackmail arc in motion:

```twee
:: Day4_Morning_C [day4 morning lily panties caught]
/* ONLY triggers if $pantiesEquipped or $lilyPantiesKept */
<<if !$pantiesEquipped and !$lilyPantiesKept>>
  /* No panties to catch = normal lazy morning */
  I try to sleep in. Lily barges in for a charger...
  <<statChange "resistance" 1>>
  <<link "Continue to afternoon" "DailyHub_Afternoon">><</link>>
<<else>>
  /* PANTY DISCOVERY SCENE */
  The door bangs open at ten AM...

  /* Full narrative: scramble, waistband visible, Lily's reaction */

  <<statChange "embarrassment" 5>>
  <<statChange "feminization" 3>>
  <<statChange "arousal" 2>>
  <<set $lilyRelationship += 3>>

  /* CRITICAL FLAGS */
  <<set $lilyCaughtPanties to true>>
  <<set $lilyBlackmailActive to true>>
  <<set $lilyPhotoCount += 1>>
  <<if !$lilyBlackmailPhotos>>
    <<set $lilyBlackmailPhotos to []>>
  <</if>>
  <<run $lilyBlackmailPhotos.push({
    day: 4,
    type: "panties_caught",
    description: "Alex standing in sweatpants with panty waistband visible",
    severity: "high"
  })>>

  <<link "Continue to afternoon" "DailyHub_Afternoon">><</link>>
<</if>>
```

### 2. Afternoon Option A: Sex Scene is Player-Initiated

The toenail painting leads to a sex scene, but the player must choose:

```twee
:: Day4_Afternoon_A [day4 afternoon chloe toenails]
Chloe opens the door...

/* Toenail removal (if Lily painted previously) */
<<if $toenailsPainted and $toenailColor is "black">>
  Chloe wrinkles her nose at the chipped black...
  <<set $toenailColor to "red">>
<<else>>
  <<set $toenailsPainted to true>>
  <<set $toenailColor to "red">>
<</if>>

/* Full toenail painting narrative */

<<statChange "feminization" 4>>
<<statChange "arousal" 2>>
<<statChange "obedience" 1>>
<<set $chloeRelationship += 4>>

/* Sex scene choice */
"You've been so good," she says. "You deserve a reward."

<<link "Follow her to the bedroom" "Day4_Afternoon_A_Sex">><</link>>
<<link "Stay and watch a movie instead" "Day4_Afternoon_A_NoSex">>
  <<statChange "resistance" 2>>
<</link>>
```

```twee
:: Day4_Afternoon_A_Sex [day4 chloe sex oral denial]
She takes my hand. Leads me to the bedroom...

/* Full oral sex scene:
   - "Take off your jeans" command
   - Panties exposed (description varies by which pair)
   - Chloe exposes herself
   - "Show me what my good girl can do"
   - FIRST USE OF "GOOD GIRL" (critical moment)
   - Detailed cunnilingus
   - Alex denied orgasm AGAIN
   - "Not today. Good girls earn their rewards over time."
*/

<<statChange "arousal" 3>>
<<statChange "obedience" 2>>
<<statChange "feminization" 2>>
<<set $chloeRelationship += 3>>
<<set $deniedOrgasm += 1>>
<<set $firstGoodGirl to true>>  /* CRITICAL: first "good girl" from Chloe */
<<set $chloeOralDay4 to true>>

<<link "Leave Chloe's apartment" "DailyHub_Evening">><</link>>
```

### 3. Evening Option A: Blackmail Has Two Branches with Very Different Consequences

```twee
:: Day4_Evening_A [day4 evening lily blackmail]
<<if $lilyCaughtPanties>>
  /* Full blackmail scene - only available if Lily caught Alex */

  She finds me in the kitchen after dinner...

  /* Full narrative: photo shown, "I might post that" threat */

  <<link "Agree to wear the hair clip" "Day4_Evening_A_Agree">><</link>>
  <<link "Refuse and counter-threaten" "Day4_Evening_A_Refuse">><</link>>

<<else>>
  /* Lily didn't catch Alex - lighter interaction */
  Lily wants to hang out. She shows me TikToks...
  <<set $lilyRelationship += 1>>
  <<link "Continue to night" "Day4_Night">><</link>>
<</if>>
```

```twee
:: Day4_Evening_A_Agree [day4 evening lily blackmail agree]
"Fine."

She lights up...

/* Full acceptance narrative */

<<statChange "obedience" 3>>
<<statChange "embarrassment" 2>>
<<set $lilyRelationship += 3>>
<<set $hairClipQuest to true>>
<<set $hairClipDay to 5>>
<<run $inventory.push("pink_butterfly_clip")>>

/* Blackmail transaction established */
<<set $lilyBlackmailCompliance to ($lilyBlackmailCompliance || 0) + 1>>

<<link "Go to bed" "Day4_Night">><</link>>
```

```twee
:: Day4_Evening_A_Refuse [day4 evening lily blackmail refuse]
"No."

She blinks...

/* Full refusal narrative - Alex threatens to tell Evelyn */

<<statChange "resistance" 3>>
<<set $lilyRelationship += 1>>
<<set $lilyBlackmailRefused to true>>

/* Lily recalibrates but doesn't give up */
<<set $lilyNextBlackmail to $day + 3>>  /* She'll try again in 3 days */

<<link "Go to bed" "Day4_Night">><</link>>
```

### 4. BBC Content Gating: Day 4 Has Three Gated Passages

```twee
/* Day4_Afternoon_B: Jamal encounter */
<<if $bbcEnabled>>
  A big dude with locs is out front, stretching...
  /* Full Jamal pre-intro with "pretty boy" */
  <<set $jamalPreIntro to true>>
  <<set $bbcCuriosity += 1>>
  <<run $inventory.push("jamal_training_card")>>
<<else>>
  I pass a gym. A guy is stretching out front. He nods. I nod back.
<</if>>

/* Day4_Evening_B: Pulse Instagram ad */
<<if $bbcEnabled>>
  At home. Scrolling Instagram...
  /* Full Pulse ad with Marcus silhouette */
  <<set $bbcCuriosity += 1>>
  <<set $pulseAdSeen to true>>
<</if>>

/* Day4_SQ_Zara: Pulse exterior encounter */
/* Zara appears regardless of BBC toggle - she's a club promoter for everyone */
/* But the description of what's INSIDE the club changes based on toggle */
```

### 5. Random Event: Evelyn Laundry Discovery

This fires during the night phase with probability:

```twee
:: Day4_Night [day4 night reflection]
/* Before reflection text, check for random laundry event */
<<if ($pantiesEquipped or $lilyPantiesKept) and !$evelynLaundryFlag>>
  <<set _laundryRoll to random(1, 10)>>
  <<if _laundryRoll <= 6>>  /* 60% chance */
    <<include "Day4_SQ_LaundryEvent">>
    <<set $evelynLaundryFlag to true>>
    <<set $evelynAwareness += 3>>
  <</if>>
<</if>>

/* Night reflection text */
Four days. That's all it's been...

/* Dynamic reflection based on day's events */
<<if $lilyCaughtPanties>>
  My stepsister has a photo of me in lingerie...
<</if>>
<<if $firstGoodGirl>>
  Chloe called me "good girl" today. Not "good boy." Girl...
<</if>>
<<if $jamalPreIntro>>
  A stranger at a gym called me "pretty boy"...
<</if>>

/* Stat display */
<div class="stat-summary"><<include "StatDisplay">></div>

<<set $day += 1>>
<<set $phase to "morning">>
<<checkUnlocks>>

<<link "Sleep — Begin Day $day" "DailyHub_Morning">><</link>>
```

### 6. New Variables Introduced on Day 4

```javascript
// Lily Blackmail System
$lilyCaughtPanties        // Lily saw Alex wearing panties
$lilyBlackmailActive      // Blackmail arc is live
$lilyBlackmailCompliance  // Counter: times Alex complied with Lily's demands
$lilyBlackmailRefused     // Alex refused Lily's first demand
$lilyNextBlackmail        // Day number for Lily's next attempt (if refused)
$hairClipQuest            // Hair clip quest active for tomorrow
$hairClipDay              // Day the clip must be worn

// Chloe Escalation
$firstGoodGirl            // Chloe called Alex "good girl" for first time
$chloeOralDay4            // Oral sex on Day 4 occurred
$toenailColor             // "red" (Chloe) or "black" (Lily) - can be overwritten

// Evelyn Awareness
$evelynLaundryFlag        // Evelyn found panties in laundry
$evelynAwareness          // Running counter of how much Evelyn knows
$heelsPolished            // Alex polished Evelyn's heels (tactile memory)
$evelynSomeday            // Evelyn said "someday" about heels

// Cafe/Work
$vanessaButtTap           // Vanessa tapped Alex's butt with menu
$vanessaSmileTraining     // "Think of something pretty" technique taught
$derekMet                 // Derek the winking customer encountered
$derekReceiptNote         // Derek left a note on the receipt
$cafeShiftCount           // Incremented

// BBC (toggle-gated)
$jamalPreIntro            // Jamal seen at gym
$jamalTrainingCard        // Has Jamal's business card
$jamalPrettyBoy           // Jamal called Alex "pretty boy"
$pulseAdSeen              // Instagram ad for Pulse Nightclub seen
$zaraMet                  // Zara met at club exterior
$zaraFlyer                // Has Pulse Nightclub flyer

// Lily Intel
$lilyProjectLSeen         // Alex saw "Project L" on corkboard

// Environment
$evelynHeelPolished       // Tactile memory of holding heels
```

### 7. Cross-Day Continuity Checks for Day 4

- [ ] `$pantiesEquipped` or `$lilyPantiesKept` gates Morning Option C (Lily catch)
- [ ] `$toenailsPainted` and `$toenailColor` modify Chloe's toenail scene (removal of black)
- [ ] `$lipGlossApplied` referenced in night reflection cumulative list
- [ ] `$purseCarried` referenced in night reflection cumulative list
- [ ] `$vanessaPostureTraining` (Day 3) builds on hip-sway lesson (Day 4)
- [ ] `$okonkwoMet` (Day 3) enables Day 4 follow-up dialogue
- [ ] `$marcusDeliveryFlag` (Day 3, BBC) connects to Pulse ad (same gold watch)
- [ ] `$ridingCropSeen` (Day 2) referenced internally during Evelyn closet scene
- [ ] `$deniedOrgasm` counter tracks cumulative denial (Day 2 + Day 4 = 2)
- [ ] `$lilyBlackmailPhotos` array grows across days

### 8. Sex Scene Technical Notes

Day 4 has ONE explicit sex scene: `Day4_Afternoon_A_Sex`

Key differences from Day 2's scene:
- First use of "good girl" (not "good boy") - tracked as `$firstGoodGirl`
- More detailed denial (Alex explicitly begs)
- Chloe's language is more overtly feminizing
- Alex's internal reaction to "girl" is described (no rejection)
- Orgasm denied again (`$deniedOrgasm` now at 2)

The scene is player-initiated. If the player chooses the movie instead, they get +2 Resistance and skip the sex content entirely.

### 9. Hub Passage: Day 4

```twee
<<if $day is 4>>
  <h2>Morning — Day 4</h2>

  <div class="day-objectives">
    <strong>Today's Objectives:</strong>
    <ul>
      <li>Advance your relationship with Chloe or Evelyn</li>
      <li>Navigate Lily's growing leverage</li>
      <li>Optional: Continue cafe shifts / Explore downtown</li>
    </ul>
  </div>

  <<if $pantiesEquipped>>
    Two things wake me up. Evelyn calling from downstairs and my cock pressing
    hard against the panties I slept in.
  <<else>>
    Evelyn's calling from downstairs. Another morning.
  <</if>>

  <<if $cafeJobStarted>>
    <<link "Cafe shift with Vanessa" "Day4_Morning_A">><</link>>
  <</if>>
  <<link "Help Evelyn (she needs shoes polished)" "Day4_Morning_B">><</link>>
  <<if $pantiesEquipped or $lilyPantiesKept>>
    <<link "Sleep in (risky — Lily might barge in)" "Day4_Morning_C">><</link>>
  <<else>>
    <<link "Sleep in" "Day4_Morning_C">><</link>>
  <</if>>
<</if>>
```

### 10. Multi-Activity Implementation for Day 4

Day 4's afternoon free roam (Option B) contains three embedded encounters:

1. Sophia window observation (embedded, automatic)
2. Jamal gym encounter (BBC-gated, embedded)
3. Zara at Pulse exterior (embedded, with flyer handoff)

These all fire within the same passage as inline content, with BBC content gated:

```twee
:: Day4_Afternoon_B [day4 afternoon freeroam]
I walk. No destination...

/* Sophia window - always shows */
I pass the yoga studio and see Sophia through the window...

<<if $bbcEnabled>>
  /* Jamal encounter */
  <<include "Day4_SQ_Jamal">>
<</if>>

/* Zara at Pulse - always shows */
<<include "Day4_SQ_Zara">>

<<statChange "confidence" 1>>
<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

### 11. Day 5 Setup Flags

Day 4 sets up multiple Day 5 events:
- `$hairClipQuest`: Alex must wear pink butterfly clip all Day 5
- Mia and Jade arrive at Chloe's (flagged since Day 3 phone call)
- Sophia's yoga invitation can now be accepted
- Multiple arcs approaching Stage 2 thresholds
- First "too many things happening" player choice pressure

The code agent for Day 5 will need to handle the hair clip as a persistent condition that modifies EVERY passage's dialogue (NPCs comment on it, Alex is self-conscious, etc.).
