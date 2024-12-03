# Main interface

## Display

Main mud display - displays all incoming text from mud

## Status display

Character status when logged into the mud if status plugin enabled

- `Weather` displays current weather for room character is in as well as the night/day and any visible moons
- `Limbs` display current limb health or armor protection
    - `Name` Logged in character
    - `Buttons` buttons to switch between health and armor display
- `Health bars` Bars that display current health
    - `HP` current health points
    - `SP` current stamina points
    - `MP` current mana/mental points
- `Experience` Displays current experience status    
    - `XP` Total experiences
    - `Needed` experience pointed needed to level
    - `Earned` Amount of experience earned since connected
    - `BankedXP` Amount of spendable experience points
- `Party health bars` Display all current party member health
- `Combat health bars` Display all attacking target health
- `Lag meter` Display approximate lag to mud

## Command input

Main command input to send text to mud or execute client commands

- `Show menu` Display the client menu
- `Show advanced editor` Open advanced editor window
- `Show command history` Display a menu of last commands executed and an option to open command history window

## Menu

The client menu 

- `Connect/Disconnect` Connect or disconnect from mud
- `Enable/Disable logging` Turn logging on/off if login plugin enabled
- `Clear display` Clear all text from the main display
- `Lock/Unlock display` Lock scrolling of display when new text is added
- `Enter/Exit fullscreen` Toggle if client is in fullscreen or normal mode
- `Show/Hide buttons` Toggle if user buttons are displayed on the screen
- `Show chat` Open chat dialog/window if chat plugin enabled
- `Show/Hide status` Toggle the display of the status display if status plugin enabled
- `Show mapper` Show mapper dialog if mapper plugin enabled
- `Manage settings` Show setting dialog
- `Manage profile` Manager your user profiles
- `Show editor` Show the advanced editor dialog
- `Paste special` If paste is supported open paste special dialog and paste modified text into command input on ok, if paste not supported enable inline paste modification flag to open dialog when paste detected `(Ctrl or Cmd) + Alt + V`
    - `Replace with` Replace all new lines with text
    - `Prefix` Prefix all lines with text
    - `Postfix` Post fix all lines with text
    - `Reset` Reset the dialog to default settings
    - `Disable` Disable the paste special flag when ok pressed
- `ShadowMUD help` Show ShadowMUD help dialog or external window if ShadowMUD plugin enabled
- `Help` Show the oiMUD help browser
- `About` Show the about dialog, can view, export, or clear exit log