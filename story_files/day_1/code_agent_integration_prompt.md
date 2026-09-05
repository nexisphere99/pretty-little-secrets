# Code Agent Prompt: Integrating Day Story Files into Pretty Little Secrets (Twine/SugarCube)

## Your Role
You are a Twine SugarCube 2.x game developer. You will receive two markdown files per game day:
1. `dayX_main_quest.md` - The main story content (6,000-12,000 words) written in first-person from Alex's perspective
2. `dayX_side_quests_npcs.md` - Side quest and NPC encounter content (4,000-8,000 words)

Your job is to convert these narrative markdown files into functional Twine SugarCube passages with proper branching, stat tracking, inventory management, and conditional display logic.

## Project File Structure

```
pretty-little-secrets/
├── src/
│   ├── init/
│   │   ├── StoryInit.tw          # All variable initialization (from 240day gameplan)
│   │   ├── ContentToggle.tw       # Content preference selection screen
│   │   └── StoryStylesheet.css    # Game CSS styling
│   ├── system/
│   │   ├── widgets.tw             # All <<widget>> definitions
│   │   ├── statChange.tw          # Softcapped stat modification widget
│   │   ├── timeAdvance.tw         # Phase/day advancement widget
│   │   ├── npcEncounter.tw        # Random NPC encounter roller
│   │   ├── checkUnlocks.tw        # Location/arc unlock checker
│   │   ├── outfitCheck.tw         # Equipped outfit feminization scorer
│   │   ├── resistanceDecay.tw     # Weekly passive resistance reduction
│   │   └── inventory.tw           # Inventory management system
│   ├── hubs/
│   │   ├── DailyHub_Morning.tw    # Morning phase activity selector
│   │   ├── DailyHub_Afternoon.tw  # Afternoon phase activity selector
│   │   ├── DailyHub_Evening.tw    # Evening phase activity selector
│   │   └── DailyHub_Night.tw      # Night reflection + stat save
│   ├── days/
│   │   ├── day001/
│   │   │   ├── Day1_Morning_A.tw      # Evelyn chores
│   │   │   ├── Day1_Morning_B.tw      # Laze around
│   │   │   ├── Day1_Morning_C.tw      # Jogging
│   │   │   ├── Day1_Afternoon_A.tw    # Visit Chloe (branches inside)
│   │   │   ├── Day1_Afternoon_A_Accept.tw  # Panties accepted
│   │   │   ├── Day1_Afternoon_A_Refuse.tw  # Panties refused
│   │   │   ├── Day1_Afternoon_B.tw    # Explore neighborhood
│   │   │   ├── Day1_Afternoon_C.tw    # Job listings
│   │   │   ├── Day1_Evening_A.tw      # Dinner (with conditional branches)
│   │   │   ├── Day1_Evening_B.tw      # Call Chloe (with conditional branches)
│   │   │   ├── Day1_Evening_C.tw      # Video games
│   │   │   ├── Day1_Night.tw          # Night reflection (conditional)
│   │   │   └── Day1_SideQuests.tw     # Side NPC encounters for the day
│   │   ├── day002/
│   │   │   └── ...
│   │   └── ...
│   ├── arcs/
│   │   ├── chloe/
│   │   │   ├── Chloe_S1_M1.tw through Chloe_S1_M15.tw
│   │   │   └── ...
│   │   ├── evelyn/
│   │   ├── lily/
│   │   ├── sophia/
│   │   ├── bbc/
│   │   │   ├── BBC_S1_E1.tw through BBC_S1_E15.tw
│   │   │   └── ...
│   │   ├── ntr/
│   │   │   ├── NTR_S1_E1.tw through NTR_S1_E15.tw
│   │   │   └── ...
│   │   └── ...
│   ├── locations/
│   │   ├── npcs/
│   │   │   ├── Neighborhood_Henderson.tw
│   │   │   ├── Neighborhood_Ali.tw
│   │   │   ├── Neighborhood_MrsDelgado.tw
│   │   │   ├── Neighborhood_Claire_T1.tw
│   │   │   ├── Neighborhood_Theo_T1.tw
│   │   │   ├── Park_Olivia_T1.tw
│   │   │   ├── Cafe_Sophia_T1.tw
│   │   │   └── ...
│   │   ├── Home.tw
│   │   ├── ChloeApartment.tw
│   │   ├── LushLatteCafe.tw
│   │   ├── OakdalePark.tw
│   │   ├── CrystalHavenMall.tw
│   │   ├── PulseNightclub.tw
│   │   ├── KinkyKittySexToyShop.tw
│   │   ├── SereneYogaStudio.tw
│   │   └── ...
│   └── endings/
│       ├── Ending_A.tw
│       └── ...
└── compiled/
    └── pretty-little-secrets.html   # Final compiled game
```

## Conversion Rules

### 1. Passage Naming Convention
Follow this naming scheme exactly:
```
Day[DayNumber]_[Phase]_[Option]           # Main choices
Day[DayNumber]_[Phase]_[Option]_[Branch]  # Sub-branches within a choice
Day[DayNumber]_Night                      # Night reflection (always one passage with conditionals)
Day[DayNumber]_SQ_[NPCName]              # Side quest NPC encounters
[Character]_S[Stage]_M[Moment]            # Arc-specific story moments
[Location]_[NPC]_[Tier]                   # Location NPC encounters
```

### 2. Converting Narrative to Passages

Each `### Option` header in the main quest MD becomes its own `.tw` passage. The narrative text is preserved as-is (first person, literary prose) but wrapped in SugarCube markup.

**Example conversion from MD to TW:**

The markdown:
```markdown
### Option A: Help Evelyn with Chores (Evelyn Arc Stage 1, Moment 1)

My alarm doesn't wake me. The sun does...
[full narrative text]

*Stats: +2 Obedience, +1 Feminization. Evelyn Relationship +3.*
```

Becomes this Twine passage:
```twee
:: Day1_Morning_A [day1 morning evelyn]
My alarm doesn't wake me. The sun does, cutting through the gap in my curtains like a blade...

/* [Full narrative text preserved exactly as written, line-broken for readability] */

"Good boy," she says, and the warmth in her voice does something to my chest.

<<statChange "obedience" 2>>
<<statChange "feminization" 1>>
<<set $evelynRelationship += 3>>
<<set $evelynChoresDay1 to true>>

/* Evelyn Arc Stage 1, Moment 1 complete */
<<set $evelynStage to Math.max($evelynStage, 1)>>

<<link "Continue to afternoon" "DailyHub_Afternoon">><</link>>
```

### 3. Branching Within Passages

When the MD has `#### If Alex Accepts:` / `#### If Alex Refuses:` blocks, create a choice point:

```twee
:: Day1_Afternoon_A [day1 afternoon chloe]
/* Narrative up to the choice point */

She holds up the panties. "Try these on," she says.

<<link "Put them on (Feminization +5, Obedience +3)" "Day1_Afternoon_A_Accept">><</link>>
<<link "Refuse (Resistance +3)" "Day1_Afternoon_A_Refuse">><</link>>
```

Then separate passages for each branch:

```twee
:: Day1_Afternoon_A_Accept [day1 afternoon chloe panties]
"Fine." The word comes out strangled...

/* Full accept narrative */

<<statChange "feminization" 5>>
<<statChange "obedience" 3>>
<<statChange "arousal" 2>>
<<set $chloeRelationship += 5>>
<<set $pantiesAccepted to true>>
<<set $pantiesEquipped to true>>
<<run $inventory.push("pink_panties")>>
<<set $equippedOutfit to "masculine_default_panties">>

<<link "Continue to evening" "DailyHub_Evening">><</link>>
```

### 4. Conditional Text Display

For passages that change based on prior choices (like the dinner scene changing if panties are worn):

```twee
:: Day1_Evening_A [day1 evening home dinner]
Lily surfaces at 6:47 PM...

/* Shared narrative */

"So," she says, "what'd you do today? Anything fun with Chloe?"

<<if $pantiesEquipped>>
My face goes nuclear. I can feel the lace against my skin right now...

/* Panties-worn variant text */

<<statChange "embarrassment" 2>>
<<set $lilyAwareness += 1>>
<<else>>
"Nothing much. Watched a movie."

Lily's interest evaporates like morning dew...
<</if>>

/* Shared ending text (Evelyn's corrections) */
<<statChange "obedience" 1>>

<<link "Continue to night" "Day1_Night">><</link>>
```

### 5. Hub Passages (Daily Phase Selectors)

Each phase hub shows available options based on day, stats, and flags:

```twee
:: DailyHub_Morning [hub]
<<if $day is 1>>
  <h2>Morning   Day 1</h2>

  <div class="day-objectives">
    <strong>Today's Objectives:</strong>
    <ul>
      <li>Explore your home and meet your family</li>
      <li>Visit Chloe's apartment</li>
      <li>Settle into your first day</li>
    </ul>
  </div>

  It's Saturday morning. The house is quiet except for Evelyn's teacup clinking downstairs.

  <<link "Help Evelyn with chores" "Day1_Morning_A">><</link>>
  <<link "Laze around the house" "Day1_Morning_B">><</link>>
  <<link "Go for a jog" "Day1_Morning_C">><</link>>

<<elseif $day is 2>>
  /* Day 2 options */
<</if>>

/* Side quest notifications */
<<if $day is 1 and !$aliMet and $neighborhoodExplored>>
  <div class="side-quest-notice">
    You noticed Ali's Corner Store on your walk. Maybe worth a visit.
  </div>
<</if>>
```

### 6. Side Quest NPC Integration

Side quest NPCs from the `dayX_side_quests_npcs.md` file get integrated two ways:

**A) Embedded in main passages**   When an NPC appears during a main quest scene (like Mr. Henderson during jogging), their text is woven directly into the main passage.

**B) Standalone side encounters**   When an NPC has their own optional scene, create a separate passage triggered from the hub or from within a location:

```twee
:: Day1_SQ_Ali [day1 sidequest neighborhood]
<<if !$aliMet and $neighborhoodExplored>>

Ali is fifty-three, Pakistani, has run this corner store for eighteen years...

/* Full Ali narrative */

<<set $aliMet to true>>
<<set $aliFamiliarity to 1>>
<</if>>
```

### 7. Night Reflection Passages

Night reflections are always one passage with heavy conditional branching:

```twee
:: Day1_Night [day1 night reflection]
<h2>Night</h2>

The house is quiet...

<<if $pantiesEquipped>>
  I can feel them. Every time I shift...

  /* Panties reflection text */

  <<if $chloePhoneCall>>
    /* Additional reflection if called Chloe */
  <</if>>

  <<statChange "feminization" 2>>  /* Extended wear bonus */
<<else>>
  I think about tomorrow...

  /* Normal reflection text */
<</if>>

/* Stat summary display */
<div class="stat-summary">
  <<include "StatDisplay">>
</div>

/* Day advancement */
<<set $day += 1>>
<<set $phase to "morning">>

/* Weekly resistance decay check */
<<if $day % 7 is 0>>
  <<resistanceDecay>>
<</if>>

/* Unlock checks */
<<checkUnlocks>>

<<link "Sleep   Begin Day $day" "DailyHub_Morning">><</link>>
```

### 8. Stat Change Widget Implementation

```twee
:: statChange [widget]
<<widget "statChange">>
  <<set _stat to _args[0]>>
  <<set _amount to _args[1]>>
  <<set _current to State.variables[_stat]>>

  /* Softcap calculation */
  <<if _current >= 90>>
    <<set _amount to Math.ceil(_amount * 0.25)>>
  <<elseif _current >= 75>>
    <<set _amount to Math.ceil(_amount * 0.5)>>
  <<elseif _current >= 50>>
    <<set _amount to Math.ceil(_amount * 0.75)>>
  <</if>>

  /* Apply change, clamp 0-100 */
  <<set State.variables[_stat] to Math.max(0, Math.min(100, _current + _amount))>>

  /* Visual feedback */
  <span class="stat-change"><<print _stat>>: <<if _amount > 0>>+<</if>><<print _amount>></span>
<</widget>>
```

### 9. Content Toggle Gating

All BBC, NTR, forced bi, and extreme content must be wrapped in toggle checks:

```twee
/* BBC content gate */
<<if $bbcEnabled>>
  /* Marcus visible at club scene */
  Across the room, a tall man in a fitted shirt catches the light...
<</if>>

/* NTR content gate */
<<if $ntrEnabled>>
  /* Chloe's suspicious phone behavior */
  She glances at her phone and smiles at something I can't see...
<</if>>
```

### 10. Inventory System

```twee
:: inventory [widget]
<<widget "addItem">>
  <<if !$inventory.includes(_args[0])>>
    <<run $inventory.push(_args[0])>>
    <span class="item-gained">Acquired: <<print _args[0]>></span>
  <</if>>
<</widget>>

<<widget "hasItem">>
  <<set _result to $inventory.includes(_args[0])>>
<</widget>>

<<widget "equipOutfit">>
  <<set $equippedOutfit to _args[0]>>
  <<outfitCheck>>
<</widget>>
```

### 11. NPC Encounter Roller

For location-based random encounters:

```twee
:: npcEncounter [widget]
<<widget "npcEncounter">>
  <<set _location to _args[0]>>
  <<set _pool to []>>

  /* Build pool based on location, stats, and flags */
  <<if _location is "park">>
    <<if $feminization >= 30 and !$npcEncounters["Park_Claire"]>>
      <<run _pool.push("Park_Claire_T1")>>
    <</if>>
    <<if $feminization >= 10>>
      <<run _pool.push("Park_Olivia_T1")>>
    <</if>>
  <<elseif _location is "neighborhood">>
    <<if $feminization >= 20 and !$npcEncounters["Neighborhood_Theo"]>>
      <<run _pool.push("Neighborhood_Theo_T1")>>
    <</if>>
  <</if>>

  /* Roll if pool isn't empty */
  <<if _pool.length > 0>>
    <<set _roll to Math.floor(Math.random() * _pool.length)>>
    <<set _encounter to _pool[_roll]>>

    /* Track encounter */
    <<set $npcEncounters[_encounter] to ($npcEncounters[_encounter] || 0) + 1>>

    <<include _encounter>>
  <</if>>
<</widget>>
```

### 12. Sex Scene Handling

Sex scenes from the narrative MDs should:
- Be placed in their own sub-passages (e.g., `Day1_Afternoon_A_Accept_Sex` if one existed on Day 1)
- Be gated behind appropriate content toggles
- Include explicit stat changes (Arousal, Corruption, specific relationship stats)
- Use `<<if $analEnabled>>`, `<<if $bbcEnabled>>`, etc. for variant content
- Never auto-play; always require a player choice to enter

```twee
:: Chloe_S1_M15_Sex [chloe stage1 sex]
/* Chloe rewards Alex with oral servitude */

<<if $arousal >= 5 and $chloeRelationship >= 15>>
  Chloe lies back on the bed, pulling her skirt up slowly...

  /* Full sex scene narrative from the arc MD */

  <<statChange "feminization" 5>>
  <<statChange "obedience" 5>>
  <<statChange "arousal" 5>>
  <<set $chloeRelationship += 3>>

  <<link "Continue" "Day1_Night">><</link>>
<<else>>
  /* Stat requirements not met - scene doesn't trigger */
  <<goto "DailyHub_Evening">>
<</if>>
```

## Processing Instructions

When you receive a pair of day files (`dayX_main_quest.md` + `dayX_side_quests_npcs.md`):

1. **Read both files completely** before writing any code
2. **Identify all choice points** (Options A/B/C, Accept/Refuse branches)
3. **Identify all conditional text** (if panties worn, if specific flag set, etc.)
4. **Identify all stat changes** (listed in italics at the end of sections)
5. **Identify all flags set** (relationship changes, awareness flags, unlock flags)
6. **Identify all NPC encounters** and whether they're embedded or standalone
7. **Identify all sex scenes** and their trigger conditions
8. **Create the hub passage** for each phase with correct day-gating
9. **Create each option as its own passage** with proper tags
10. **Create sub-branch passages** for accept/refuse and conditional paths
11. **Create the night reflection** with all conditional variants
12. **Create side quest passages** as standalone encounters
13. **Wire all links** so every passage connects back to the hub or forward to the next phase
14. **Add content toggle gates** around any BBC/NTR/extreme/forced-bi content
15. **Test all paths mentally** to ensure no dead-end passages exist

## Key Variables Reference (from StoryInit)

```javascript
// Primary stats
$feminization, $obedience, $embarrassment, $arousal    // 0-100
$confidence, $resistance                                // 0-100 (resistance starts 100)
$corruption                                             // 0-100
$money                                                  // dollars

// Toggle flags
$bbcEnabled, $ntrEnabled, $forcedBiEnabled, $extremeEnabled, $publicEnabled, $analEnabled

// Arc-specific
$bbcCuriosity, $ntrAcceptance                           // 0-100

// Relationship (per character)
$chloeRelationship, $evelynRelationship, $lilyRelationship, $sophiaRelationship
$marcusRelationship, $jamalRelationship, $bigTRelationship, $deshawnRelationship

// Stage tracking
$chloeStage, $evelynStage, $lilyStage, $sophiaStage, $vanessaStage
$ravenStage, $taraStage, $ravennaStage, $zaraStage, $marcusStage, $damienStage

// Day/Time
$day, $phase                                            // phase: "morning"/"afternoon"/"evening"/"night"

// Key flags
$pantiesAccepted, $pantiesEquipped, $pantiesRefused
$cafeJobApplied, $cafeJobStarted
$sophiaNoticed, $claireNoticed, $theoNoticed
$aliMet, $hendersonFamiliarity, $delgadoAwareness
$lilyAwareness
$chastityLocked, $hormoneStarted, $nameChanged
$firstBBCBlowjob, $firstNTRWitness, $marcusCollared

// Inventory
$inventory                                              // array of item strings
$equippedOutfit                                         // current outfit string
$equippedAccessories                                    // array

// NPC tracking
$npcEncounters                                          // object: { "Location_Name": count }

// Location unlocks
$mallOpen, $clubOpen, $shopOpen, $yogaOpen, $parkOpen, $loungeOpen, $gymOpen
```

## Quality Checks

Before submitting converted passages, verify:
- [ ] Every passage has at least one outgoing link (no dead ends)
- [ ] Every stat change uses the `<<statChange>>` widget (for softcapping)
- [ ] Every item gained uses `<<addItem>>` widget
- [ ] All conditional text uses proper `<<if>>` / `<<else>>` / `<</if>>` syntax
- [ ] Content-toggled sections are wrapped in appropriate `<<if $toggleEnabled>>` blocks
- [ ] Night reflection accounts for ALL possible combinations of day choices
- [ ] NPC encounters respect feminization thresholds from their source files
- [ ] Sex scenes are gated behind both stat thresholds AND player choice (never auto-play)
- [ ] Passage tags include day number, phase, and character name for organization
- [ ] No orphaned passages (every passage is reachable from at least one link)
- [ ] Day objectives display at morning hub and clear at next day's morning hub
- [ ] Side quest NPCs that are "glimpse only" don't offer interaction beyond observation
