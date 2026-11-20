# Elite: Dangerous Journal Companion for Firebot


## Global Variables

- Commander Name (`$edjcCommanderName`)
- Current system (`$edjcSystemName`)

## Events

Almost all events triggered carry the raw data from the journal entry. Feel free to access/explore them via the $eventData variable.

### Common
- Wing Add (`$edjcWingMember`)
- Wing Invite
- Wing Join
- Wing Leave

### Travel
- Location
- FSD Start
- FSD Jump
  - Filters
    - Taxi (boolean)
    - Jump Type ('Hyperspace', 'Supercruise')
  - Variables 
    - `$edjcCurrentJumpSystemName` (only for Hyperspace)
    - `$edjcCurrentJumpSystemStarClass` (only for Hyperspace)
- ApproachBody
- SupercruiseExit
- Touchdown
- Disembark
- Embark
- LaunchSRV
- LaunchVessel
- DockSRV
- Liftoff
- Undocked

### Combat
- Heat Warning
- Heat Damage
- Shields State
  - Filters
    - Shield State (boolean)
  - Variables
    - `$edjcShieldState` (boolean)
- Died
- Inderdicted
  - Filters
    - Is Player (boolean)
- Interdiction
  - Filters
    - Success (boolean)
    - Is Player (boolean)

