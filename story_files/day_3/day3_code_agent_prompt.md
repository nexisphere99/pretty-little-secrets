# Code Agent Prompt: Day 3 Integration into Pretty Little Secrets (Twine/SugarCube)

## Source Files
- `day3_main_quest.md` - Main story content (~10,500 words)
- `day3_side_quests_npcs.md` - Side quest/NPC content (~5,000 words)

## File Output Structure

```
src/days/day003/
├── Day3_Morning_A.tw              # First cafe shift (Vanessa intro)
├── Day3_Morning_B.tw              # Evelyn closet task (silk scarves)
├── Day3_Morning_C.tw              # Help Lily with photography
├── Day3_Afternoon_A.tw            # Visit Chloe - park picnic + purse
├── Day3_Afternoon_A_Carry.tw      # Carry the pink purse
├── Day3_Afternoon_A_Return.tw     # Hand purse back
├── Day3_Afternoon_B.tw            # Visit Kinky Kitty (Raven intro)
├── Day3_Afternoon_C.tw            # Mall area walk (Velvet Boutique)
├── Day3_Evening_A.tw              # Evelyn dinner etiquette
├── Day3_Evening_B.tw              # Chloe phone call ("pretty")
├── Day3_Evening_C.tw              # Lily's panty gift
├── Day3_Evening_C_Keep.tw         # Keep the panties
├── Day3_Evening_C_Trash.tw        # Throw panties away
├── Day3_Night.tw                  # Night reflection
├── Day3_SQ_Okonkwo.tw             # Mrs. Okonkwo cafe encounter
├── Day3_SQ_MarcusDelivery.tw      # Marcus building delivery (BBC gated)
├── Day3_SQ_Ali.tw                 # Ali crossword "unveil"
├── Day3_SQ_Delgado.tw             # Mrs. Delgado park observation
├── Day3_SQ_Uniform.tw             # Cafe uniform try-on
└── Day3_SQ_Boutique.tw            # Velvet Boutique "A" necklace
```

## Day 3 Specific Conversion Notes

### 1. Morning Option A: Cafe Shift is Complex with Embedded Side Quests

The cafe shift is one continuous scene but contains multiple NPC encounters and optional side events that should be embedded as inline links:

```twee
:: Day3_Morning_A [day3 morning cafe vanessa]
My alarm screams at 7:30...

/* Main Vanessa introduction and shift narrative */

/* After first delivery section, embed optional BBC encounter */
<<if $bbcEnabled>>
  /* Link to Marcus delivery side quest */
  My third delivery goes to a high-rise downtown...
  <<include "Day3_SQ_MarcusDelivery">>
<</if>>

/* After busing tables section, embed Mrs. Okonkwo */
<<include "Day3_SQ_Okonkwo">>

/* Vanessa hip-walk training section */
Between my second and third delivery, she calls me behind the counter...

/* End of shift */
<<statChange "feminization" 1>>
<<statChange "obedience" 2>>
<<statChange "confidence" 1>>
<<set $money += 23>>
<<set $vanessaRelationship += 3>>
<<set $cafeJobStarted to true>>
<<set $cafeShiftCount to 1>>
<<set $vanessaPostureTraining to true>>

/* Side quest: Uniform try-on */
<<link "Check your staff locker before leaving" "Day3_SQ_Uniform">><</link>>
<<link "Head straight home" "DailyHub_Afternoon">><</link>>
```

### 2. BBC-Gated Content: Marcus Delivery

This is the first BBC content in the game. It MUST be wrapped in toggle check:

```twee
:: Day3_SQ_MarcusDelivery [day3 sidequest bbc marcus]
<<if $bbcEnabled>>
  My third delivery of the morning goes to a high-rise downtown...

  /* Full narrative: hand, voice, cologne, $20 tip */
  /* Marcus is NOT seen. Only sensory details. */

  <<set $money += 13>>  /* Extra tip beyond normal */
  <<set $marcusDeliveryFlag to true>>
  <<set $bbcAtmospheric += 1>>

  /* Back at cafe */
  At the counter, Vanessa sees my expression...
  "M. Jackson. He always tips like that."
  <<set $marcusNameKnown to true>>
<<else>>
  /* Generic delivery, no BBC content */
  My third delivery goes to an office building downtown. Standard tip.
  <<set $money += 3>>
<</if>>
```

### 3. Afternoon Option A: Park Purse Has Clear Binary Branch

```twee
:: Day3_Afternoon_A [day3 afternoon chloe park]
Chloe is buzzing when I arrive...

/* Picnic setup narrative */

She holds out her purse. "Carry this for me? My shoulder's sore."

<<link "Take the purse and carry it" "Day3_Afternoon_A_Carry">><</link>>
<<link "Hand it back politely" "Day3_Afternoon_A_Return">><</link>>
```

```twee
:: Day3_Afternoon_A_Carry [day3 afternoon chloe purse public]
I take it automatically...

/* Full public purse-carrying narrative */
/* Include: couple's reaction, "good helper," arousal response */

<<statChange "obedience" 3>>
<<statChange "embarrassment" 3>>
<<statChange "feminization" 2>>
<<set $chloeRelationship += 3>>
<<set $firstPublicFem to true>>
<<set $purseCarried to true>>

/* Mrs. Delgado sees this if at park */
<<if visited("Day3_SQ_Delgado")>>
  <<set $delgadoPurseSeen to true>>
<</if>>

<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

### 4. Afternoon Option B: Raven Introduction is a New Arc Start

```twee
:: Day3_Afternoon_B [day3 afternoon kinkyKitty raven]
The neon cat winks...

/* Full Kinky Kitty shop interior description */
/* Full Raven introduction */

<<statChange "confidence" 1>>
<<statChange "embarrassment" 2>>
<<set $ravenRelationship += 2>>
<<set $shopJobApplied to true>>
<<set $shopJobStartDay to 10>>
<<set $ravenMet to true>>

/* Raven's text message */
<<set $ravenHasNumber to true>>

<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

### 5. Evening Option C: Lily's Panty Gift Has Conditional Depth

The scene changes based on whether Alex already has Chloe's panties:

```twee
:: Day3_Evening_C [day3 evening lily panties]
"Psst. Alex."

Lily appears in my doorway...

/* Full panty gift narrative */

<<link "Keep them (hide in drawer)" "Day3_Evening_C_Keep">><</link>>
<<link "Throw them away" "Day3_Evening_C_Trash">><</link>>
```

```twee
:: Day3_Evening_C_Keep [day3 evening lily panties keep]
<<if $pantiesEquipped>>
  /* DUAL PANTIES narrative - wearing Chloe's, keeping Lily's */
  There's a vertiginous quality to this moment...
<<else>>
  /* FIRST PANTIES from Lily (if Chloe was refused) */
  I hold them up. They're small. Delicate...
<</if>>

<<statChange "feminization" 2>>
<<statChange "embarrassment" 1>>
<<set $lilyRelationship += 2>>
<<run $inventory.push("black_lace_panties_lily")>>
<<set $lilyPantiesKept to true>>

<<link "Go to bed" "Day3_Night">><</link>>
```

### 6. Night Reflection: Cumulative Awareness

Day 3's night reflection is the first time Alex explicitly articulates that he's been "adjusting" rather than "fighting." This is a key narrative threshold:

```twee
:: Day3_Night [day3 night reflection]
<h2>Night</h2>

Day 3.

<<if $cafeJobStarted>>
  I have a job at a cafe where a woman with red lipstick ties my apron...
<</if>>

<<if $ravenMet>>
  I might have a second job at a sex shop where a gothic queen called me "boy"...
<</if>>

<<if $yesMaamAccepted>>
  My stepmother is teaching me table manners with the patience of someone sculpting marble...
<</if>>

<<if $lipGlossApplied>>
  My girlfriend put lip gloss on me yesterday and I can still taste it...
<</if>>

<<if $lilyPantiesKept or $lilyHasNailPhoto>>
  My stepsister gave me panties as a joke, except nothing Lily does is a joke.
<</if>>

/* The key realization - always plays on Day 3 regardless of choices */
I'm lying in bed and I realize something that makes my stomach flip.

I've been adjusting. Not fighting. Not really.

<<if $evelynRelationship >= 10>>
  When Evelyn corrects my posture, I fix it.
<</if>>
<<if $lipGlossApplied>>
  When Chloe puts gloss on my lips, I leave it.
<</if>>
<<if $vanessaPostureTraining>>
  When Vanessa adjusts my shoulders, I lean into her hands.
<</if>>
<<if $lilyRelationship >= 8>>
  When Lily dares me, I consider it.
<</if>>
<<if $ravenMet>>
  When Raven says I'll look adorable, I wonder what the apron looks like.
<</if>>

When did I become so agreeable?

/* Stat display */
<div class="stat-summary">
  <<include "StatDisplay">>
</div>

<<set $day += 1>>
<<set $phase to "morning">>
<<checkUnlocks>>

<<link "Sleep — Begin Day $day" "DailyHub_Morning">><</link>>
```

### 7. Hub Passage: Day 3

```twee
/* Inside DailyHub_Morning */
<<if $day is 3>>
  <h2>Morning — Day 3</h2>

  <div class="day-objectives">
    <strong>Today's Objectives:</strong>
    <ul>
      <li>Start your first shift at Lush Latte Cafe</li>
      <li>Deepen a relationship with one core character</li>
      <li>Optional: Inquire about Kinky Kitty job / Explore mall area</li>
    </ul>
  </div>

  <<if $pantiesEquipped>>
    I shower, get dressed. Pull on jeans and feel the lace adjust. Another day.
  <<else>>
    I shower, get dressed. Jeans, t-shirt, sneakers. Regular guy clothes.
  <</if>>

  <<if $cafeJobApplied>>
    <<link "First cafe shift — meet Vanessa (9 AM)" "Day3_Morning_A">><</link>>
  <</if>>
  <<link "Help Evelyn with her morning task" "Day3_Morning_B">><</link>>
  <<link "Help Lily with her photography project" "Day3_Morning_C">><</link>>

  <<if !$cafeJobApplied>>
    <em>You haven't applied for the cafe job yet. You can still apply today at the cafe (Afternoon option) or online tonight.</em>
  <</if>>
<</if>>
```

### 8. New Variables Introduced on Day 3

```javascript
// Cafe
$cafeJobStarted           // First shift completed
$cafeShiftCount           // Running count of shifts worked
$vanessaPostureTraining   // Vanessa has trained Alex's posture
$cafeUniformTried         // Alex tried on the polo in the locker room
$cafeUniformInstruction   // Vanessa said to wear it against skin

// Raven / Kinky Kitty
$ravenMet                 // Raven properly introduced
$shopJobApplied           // Applied for Kinky Kitty job
$shopJobStartDay          // Day 10
$ravenHasNumber           // Raven has Alex's phone number

// BBC (toggle-gated)
$marcusDeliveryFlag       // Delivered to Marcus's building
$marcusNameKnown          // Knows the name "M. Jackson"
$bbcAtmospheric           // Counter for atmospheric BBC encounters

// Chloe
$firstPublicFem           // First public feminine behavior (purse)
$purseCarried             // Carried Chloe's pink purse

// Lily
$lilyPantiesKept          // Kept Lily's panty gift
$lilyPhotographyDone      // Lily's portrait session completed
$softFeaturesMentioned    // Lily called Alex's features "soft"

// Evelyn
$scarfMoment              // Evelyn caught Alex admiring the lavender scarf
$closetOrganized          // Evelyn's closet organized

// NPCs
$okonkwoMet               // Mrs. Okonkwo introduced at cafe
$delgadoPurseSeen         // Mrs. Delgado saw Alex carry the purse

// Environmental
$boutiqueNecklaceSeen     // "A" necklace spotted in Velvet Boutique window
$boutiqueReflection       // Alex saw his reflection overlaid on dress mannequin
```

### 9. Content Toggle Summary for Day 3

| Toggle | Content Present | Passage |
|---|---|---|
| `$bbcEnabled` | Marcus delivery (hand/voice/cologne) | Day3_SQ_MarcusDelivery |
| `$bbcEnabled` | Mrs. Okonkwo's son mention (atmospheric) | Day3_SQ_Okonkwo |
| All others | No gated content on Day 3 | N/A |

Day 3 is still early enough that only BBC atmospheric content appears. NTR, forced bi, extreme, and public content toggles don't gate anything yet.

### 10. Multi-Activity Implementation for Day 3

Day 3 is the first day where the cafe shift naturally contains multiple sub-encounters. The morning cafe shift should include:

1. Vanessa introduction (main)
2. Hip-walk training (embedded)
3. Mrs. Okonkwo encounter (embedded via `<<include>>`)
4. Marcus delivery (BBC-gated, embedded via `<<include>>`)
5. Uniform try-on (optional link at end)

This creates a morning slot that feels rich and populated without requiring separate time slots for each NPC.

For afternoon, if the player chooses "Mall area walk," embed the Velvet Boutique window scene and the boutique girl encounter within the same passage, plus an optional link to Ali's store.

### 11. Cross-Day Continuity Checks for Day 3

- [ ] `$cafeJobApplied` (Day 1 or 2) determines if cafe shift is available as Morning Option A
- [ ] `$pantiesAccepted` / `$pantiesEquipped` modifies morning dressing narration
- [ ] `$evelynChoresDay1` and `$yesMaamAccepted` determine Evelyn morning path (warm vs cold)
- [ ] `$kinkyKittyNoticed` (Day 2) reduces Embarrassment on Kinky Kitty entry
- [ ] `$lipGlossApplied` (Day 2) referenced in night reflection
- [ ] `$toenailsPainted` (Day 2) not directly referenced but contributes to cumulative Fem stat
- [ ] `$sophiaMet` (Day 2) means Sophia is now a known NPC (no re-introduction needed)
- [ ] Night reflection dynamically builds from ALL prior flags (not just Day 3 choices)

### 12. Sex Scene Notes for Day 3

Day 3 has NO explicit sex scenes in the main quest. The closest is:
- Chloe's park scene generates arousal through public humiliation (purse) but no sexual contact
- Vanessa's physical touch (apron tying, shoulder adjustment) is sensual but not sexual

This is intentional. Day 2 had the oral sex scene. Day 3 is a cooldown that builds tension through non-sexual intimacy and public exposure. Day 4 should re-escalate with Chloe's toenail painting + potential sex event, or Evelyn's table manners advancing to more intimate corrections.

The arousal stat should still be building through denial. If `$deniedOrgasm >= 1` (from Day 2), the night reflection can include a line about Alex being unable to sleep due to pent-up tension, reinforcing the denial dynamic without an explicit scene.
