# Preferences

## Breadcrumb

The navigation breadcrumb to allow easier jumping to other pages

## Main interface

- `Left panel` List of setting categories
- `Right panel` Settings under category to edit

## Footer buttons

- `Reset` Reset current page settings to default
- `Reset all` Reset all settings to default
- `Export` Export settings as text file
- `Import` Import settings from text file
- `Save` Save settings and close dialog
- `Cancel` Close dialog with out saving

## General

- `Auto connect onload` This will cause the client to try and connect as soon as the client has finished loading.
- `Auto connect delay` This determines the delay before an auto connect happens
- `On disconnect do` What to do when disconnected from the mud
  - `Nothing` do nothing
  - `Reconnect` reconnect using auto connect options
  - `Reconnect dialog` show the reconnect dialog with options and delayed reconnect timer
  - `Character manager` show character manager
  - `Close` close the client
- `Max reconnect delay` set the maximum time in seconds, for reconnecting when using reconnect dialog, setting to 0 will revert to classic unlimited behavior.
- `Enable sound` Disable or enable sound globally
- `Simple editor` Turn off advanced editor formatting and enable simple text editing only
- `Clear editor on send` clear the advanced editor after sending text to the mud
- `Close editor on send` close the advanced editor after sending text to the mud, **Note** If Persistent is enabled this will merely hide the editor until next use
- `Persistent editor` Keep editor loaded in background instead of unloading, uses more memory but window opens faster
- `Reset editor dialog state` Reset the editor window state, **Note** if dialog open will reuse active state on close
- `Show buttons` Show user buttons on screen
- `Enable parsing` Enable text parsing
- `Enable triggers` Enable trigger system
- `Reset help dialog state` Reset the help dialog state, **Note** if dialog open will reuse active state on close

## Display

- `Font` The font for the display area, mono spaced fonts work the best.
- `Font size` The font size for the display area
- `Auto copy selected to clipboard` This will copy selected text to the clipboard automatically when mouse released and then clear selection
- `Echo commands` Will display commands as they are sent to the mud
- `Enable colors` disable or enable all colors
- `Enable background colors` disable or enable just background colors
- `Enable flashing text` Enable ansi flashing/blinking text, when disabled flashing text appears as underlined text **Note** this can cause a performance hit when enabled.
- `Buffer size` How many lines to keep in the display before removing them, **Note** the higher this is the more memory or slower things might get.
- `Enable URL detection` Attempt to detect urls and convert them into links that can be clicked to. **Note** Effects both chat and main display
- `Focus to command input on click` Will auto focus to the command input when the display area is clicked.
- `Word wrap` enable word wrap for long lines when possible
- `Word wrap column` set a fixed text column to attempt to wrap when word wrap enabled, set to 0 to wrap based on window size
- `Word wrap indent` amount of spaces to indent wrapped lines
- `Show timestamp` display the timestamp for when line of text was added
- `Timestamp format` the timestamp display format **Note** Supports all moment time formats
- `Tab width` How many spaces in a tab
- `Show invalid MXP tags` display any MXP tags as normal text if they are not standard or custom elements **Note** Effects both chat and main display
- `Display control codes` Display unreadable characters, code < 32 || 127 as visual characters
- `Emulate terminal extended characters` Enable/disable Terminal IBM/OEM (code page 437) extended characters, will convert them to the correct unicode character in an attempt to display like classic terminal
- `Emulate control codes` Emulate control codes: bell, tab, backspace, escape
- `Hide trailing line` Hide trailing empty line, **Note** if more then one it will only hide the final line **Note** Effects both chat and main display

## Colors

- `Color scheme` Let you pick predefined colors schemes for colors
- `Foreground` The foreground colors
- `Background` The background colors
- `Bold` Bold style colors
- `Faint` Faint style colors

### Color types

- `Default` The default font color when no color codes have been supplied
- `Echo` The local echo color
- `Information` The color of any information from the client
- `Error` The color of error messages
- `Ansi colors` You can set the 8 regular colors, 8 background colors, 8 bold/bright colors and the 8 faint colors.

## Command line

- `Font` The font for the command input box
- `Font size` The font size for the command input box
- `Keep Last Command` This leaves the last command entered into the command input and selected it, if disabled it will be cleared
- `Select Last Command` This selects the last command if keep last command enabled
- `History Size` The number of items to keep in command history when navigating using the up/down arrow.
- `Newline shortcut` A shortcut for adding newlines to command input
  - `None` no shortcut enter always sends command
  - `Ctrl + Enter` add newline on ctrl+enter
  - `Shift + Enter` add newline on shift+enter
  - `(Ctrl | Shift) + Enter` add a new line on ctrl+enter or shift+enter
  - `Ctrl + Shift + Enter` add a newline on ctrl+shift+enter
- `Auto size to contents` Resize command input height based on contents
- `Word wrap` Wrap long lines in command input
- `Scrollbars` Add scrollbars when needed to command input
- `Minimum number of lines` The minimum # of lines to display in command prompt, min of 1, max of 30 or 50% of the display screen

## Tab completion

- `Enable tab completion` Enable tab complete, when enabled pressing tab will complete the current word form the last lines of buffered text
- `Ignore case for tab completion` Ignore letter cashing when searching for matching words
- `Tab completion buffer limit` The number of buffered lines to use for tab completion
- `Tab completion replace casing` The casing to use for the tab completion
  - `Original` Use the words original casing
  - `Lower case` Convert to all lower case
  - `Upper case` Convert to all upper case
- `Tab completion lookup type` Where to look up tab completion, word lookup starts from left to right/top to bottom for list, and right to left/buffer newest to oldest for buffered lines
  - `Prepend list to buffer` Prepend completion list to buffer for look up
  - `Append list to buffer` Append completion list to end of buffer for look up
  - `Buffer only` Use buffer only for look up
  - `List only` Use tab completion list only for look up
- `Tab completion list` Custom list of words to prepend, append, or use for tab completion

## Logging

Only if logging plugin enabled

- `Enable Logging` Enable logger, can also be toggled by the log icon on the toolbar.
- `Pre-pend current buffer starting to log` Will pre-pend the current text on display to the log when started
- `Enable Logging of offline text` Log text when not connected.
- `Create logs for every connect session` This setting will force a new log every time you connect to the mud, if disabled it will attempt to create one large log for the current session.
- `Log gagged lines` This forces the logger to include any lines that may have been hidden, for example when capture chat is enabled the lines are removed from the main flow, this setting will enable you keep them or keep the log as only whats on the display.
- `Log what` what type formatted text to log
  - `HTML` log text as formatted html into a LOGNAMEFORMAT.htm log file
  - `Text` log text to LOGNAMEFORMAT.txt log file
  - `Raw` log all text and raw control codes to LOGNAMEFORMAT.raw.txt log file
- `Date/time format` format for date/time when included in log file name **Note** Supports all moment time formats, **WARNING** take note of your operating system's allowed characters or it may break logging when exported
- `Timestamp` Add timestamp to each logged line
- `Timestamp format` Time stamp format, **Note** Supports all moment time formats
- `Persistent log manager dialog` Keep long manager dialog loaded in background instead of unloading, uses more memory but window opens faster
- `Reset manager dialog state` Reset the manager dialog state, **Note** if dialog open will reuse active state on close

## Telnet

Settings to control how to handle telnet options and emulation

- `MUD Compression Protocol (MCCP)` Disables or enables MUD Client Compression Protocol, this allows the mud to send all data as compressed to save bandwidth, only disable if you seem to have issues or need to try and save some local resources.
- `UTF-8` Disables or enables UTF8 processing, disabling it may gain you some cpu or speed but you could get garbled or incorrectly displayed text.
- `MUD eXtension Protocol (MXP)` Disables or enables MUD eXtension Protocol parsing and telnet option
- `Echo` Disable or enables Echo option to display/hide text when server requests
- `Enable GMCP Ping` When text received from mud send back a GMCP ping if enabled to get a better time for the lag meter.
- `MUD Sound Protocol (MSP)` Disable or enable MSP
- `Display Notification on MSP Play` Display a message when a file has started to play
- `MSP: max retries on error` Amount of retries to attempt play a file before stopping, 0 disables

## Scripting

- `Allow evaluate` will enable ${expression} evaluation
- `Show Script Errors` Disable any errors that triggers, aliases, or macros produces when script type.
- `Disable trigger on error` Disable a trigger if an error happens when executing a trigger
- `Parse single quotes as strings` Treat single quotes as string encasing, meaning all text found inside single quotes are treated as is and not parsed.
- `Parse double quotes as strings` Treat double quotes as string encasing, meaning all text found inside double quotes are treated as is and not parsed.
- `Prepend triggered line` Disable the fix to prepend the triggered line as %0,$0, or %{0} to return to previous usage
- `Enable Double Parameter Escaping` Enable doubling up of the parameter character `%` to escape as well as using escape character
- `Ignore Eval Undefined` When enabled will make undefined results blank, else it will display the word undefined
- `Allow Comments From Command` Allow inline and block comments from the command input
- `Ignore leading whitespace` Ignore leading whitespace for commands and aliases
- `Delay between path commands` The amount of milliseconds between sending of path commands for speed paths.
- `Amount of path commands to send` the # of commands to send between speed path delay
- `Initialize expression engine on load` Initialize the expression engine on client load instead of on first use, enabling this can cause client to load slower but can speed up first use of an expression
- `Echo` Determine what echos to the screen
  - `Triggers` Echo trigger pattern to screen if fired, **Warning** this may cause infinite looping if pattern is exact matching
  - `Scripts` Echo script type values to the screen before they are executed
  - `Commands` Echo #commands to the screen

## Special characters

- `Command Stacking`
  - `Character` The character to use when repeating command into multiple commands, Default: `;`
  - `Enable` This will enable command stacking systems and use the command stacking character to know where to break a command into a list commands.
- `Speedpaths`
  - `Character` The character that is used to determine if the command is a speedpath to expand, Default: `!`
  - `Enable` Whether or not to expand speedpaths, if disabled the line is parsed as normal command
  - `Parse` Parse each command as if it was sent from the command line, if disabled each command is sent to the mud as is.
  - `Echo` Echo each command to the screen as they are sent
- `Command`
  - `Character` The character to use with build in client commands, Default: `#`
  - `Enable` This will enable or disable command systems
- `Escape`
  - `Character` The character to use when escaping $%"'{ or special characters, Default: `\`
  - `Enable` Enable escaping of characters
- `Verbatim`
  - `Character` The character used at the start of a line to signify the line should be sent as is starting after the verbatim character, Default: `
  - `Enabled` Enable or disable verbatim system
- `Parameter`
  - `Character` The character used for inline variables and functions and trigger/alias parameters %#, see [functions](functions.md) for more details, Default: `%`
  - `Enabled` Enable or disable parameters
- `N Parameter`
  - `Character` Similar to Parameter but allows full name symbols when possible for user variables and named parameters, eg $name, see [functions](functions.md) for more details, Default: `\$`
  - `Enabled` Enable or disable N Parameter system
- `Inline Comment`
  - `String` The 1 or 2 character string for inline comments, Default: `//`
  - `Enabled` Enable or disable inline comments
- `Block Comment`
  - `String` The 1 or 2 character string for block comments, closing block comment is the string reversed, Default: `/*`
  - `Enabled` Enable or disable block comments

## Panel Bar

Controls the panel bar with extras

- `Show panel bar` Is panel bar visible
- `Show map` Show map panel 
- `Show chat` Show chat capture panel,
- `Location` Where to place panel bar
  - `Left` To the left of the main display
  - `Top` Above the main display  
- `Size` The size of the panel bar, width if left, height if top, min of 184 or 1/3 of current window size, will adjust to new max as window is resized

Settings for map and chat panels are shared with main mapper and chat capture syste, If both map and chat are disabled, panel bar will be hidden

## Chat

Controls what is captured into the chat window

- `Window Type` The type of window type for chat capture
  - `Default` Will use default type of dialog
  - `Window` Use external window
  - `Dialog` Use a dialog window
  - `Both` Use both a dialog window and external window
- `Capture tells` Causes all tells, emoteto, shouts and any related lines.
- `Capture talk` Capture all talking, which are says, yells, whispers, and speaking and any related lines.
- `Capture reviews` Determines if line, say, or tell reviews are captured. The capturing is determined based on the settings enabled. Tell reviews are only captured if capture tells is enabled, say review with only capture say, all line reviews or selective reviews when enabled.
- `Gag` Gag lines from main display
- `Log` Log captured chat to a separate log file
- `Capture only when open` Only capture when window is open
- `Capture lines` Enable capture of chat lines
  - `All` capture all chat lines
  - `Selective` capture only those provided in the selective lines list
- `Selective lines` A comma delimited list of lines to selectively capture, For example: Chat,Rp,Mudinfo will capture Chat, Rp, and Mudinfo lines.
- `Persistent dialog` Keep chat dialog loaded in background instead of unloading, uses more memory but window opens faster
- `Reset chat dialog state` Reset the chat dialog state, **Note** if dialog open will reuse active state on close
- `Reset chat window state` Reset the chat window state, **Note** if window open will reuse active state on close

## Chat Display

- `Font` The font for the display area, mono spaced fonts work the best.
- `Font size` The font size for the display area
- `Enable colors` disable or enable all colors
- `Enable background colors` disable or enable just background colors
- `Enable flashing text` Enable ansi flashing/blinking text, when disabled flashing text appears as underlined text **Note** this can cause a performance hit when enabled.
- `Buffer size` How many lines to keep in the display before removing them, **Note** the higher this is the more memory or slower things might get.
- `Enable URL detection` Attempt to detect urls and convert them into links that can be clicked to, **Note** Effects both chat and main display
- `Word wrap` enable word wrap for long lines when possible
- `Word wrap column` set a fixed text column to attempt to wrap when word wrap enabled, set to 0 to wrap based on window size
- `Word wrap indent` amount of spaces to indent wrapped lines
- `Show timestamp` display the timestamp for when line of text was added
- `Timestamp format` the timestamp display format **Note** Supports all moment time formats
- `Tab width` How many spaces in a tab
- `Show invalid MXP tags` display any MXP tags as normal text if they are not standard or custom elements, **Note** Effects both chat and main display
- `Display control codes` Display unreadable characters, code < 32 || 127 as visual characters
- `Emulate terminal extended characters` Enable/disable Terminal IBM/OEM (code page 437) extended characters, will convert them to the correct unicode character in an attempt to display like classic terminal
- `Emulate control codes` Emulate control codes: bell, tab, backspace, escape
- `Hide trailing line` Hide trailing empty line, **Note** if more then one it will only hide the final line, **Note** Effects both chat and main displayay

## Status

- `Show status` Show the status display
- `Enable simple mode` Show simple status mode, Displays an hp, sp, mp, xp needed bar at top of display and lag meter bar just above command input, **Note** this is the on by default when first loaded from a detected mobile browser
- `Show weather` Show the weather info
- `Show heath` Show the health info
- `Show limbs` Show the limb display
- `Show experience` Show the experience info
- `Show party's health` Show party health bars
- `Show attacker's health` Show attacker health bars
- `Show armor protection` Put limb display in armor protection mode
- `Show lag meter` Whether to enable the lag meter, **Note** this is not 100% correct always due to overhead variables that cant be controlled.
- `Show lag in title` Display lag in title bar, **Note** this is not 100% correct always due to overhead variables that cant be controlled.
- `Allow negative number for experience needed` causes the needed xp value in status display to allow to display negative when you have xp over required amt.
- `Show Experience Needed as Progressbar` display the experience needed value as a progress bar
- `Width` The width of the status bar, min of 184 or 1/3 of current window size, will adjust to new max as window is resized
- `Persistent skills dialog` Keep skills dialog loaded in background instead of unloading, uses more memory but window opens faster
- `Reset skill dialog state` Reset the skill dialog state, **Note** if dialog open will reuse active state on close

## Mapper

- `Open on load` Open the mapper when you load the client
- `Enable Mapper` Enable the mapper and create rooms as player moves
- `Follow Player` Set the current room to the players as they move
- `Show legend` Show map legend
- `Split Areas` Attempt to draw maps split up by area/zones
- `Display Walls` Draw walls between rooms to try and help display a more dungeon feel
- `Delay between directions` The amount of milliseconds between sending # of directions for speed walking.
- `Directions to send` the # of directions to send between delays
- `Persistent` Keep mapper dialog loaded in background instead of unloading, uses more memory but window opens faster
- `Reset dialog state` Reset the dialog state, **Note** if dialog open will reuse active state on close

## Advanced

- `Enable debug` Will display debug data to the dev tool console
- `Log errors` Log errors, managed and accessed in about dialog
- `Show extended error messages` Display extended stack information for errors
- `Simple alarms` Enable simple alarm pattern matching instead of using moment duration
- `Save Trigger State Changes` When a trigger state changes save profile
- `Return newline on empty value` Return new line if processed item value is empty
- `Parse commands` Enable parsing of commands from command line or sendBackground/sendCommand scripting functions
- `Enable Notifications` Enable notifications, effects [#notify](commands.md#Miscellaneous) and [client.notify](scripting.md)
- `Enable gamepads` Enable gamepad support to allow creating macros using gamepad axes or buttons. **Experimental**
- `Fix hidden windows` Adjust the x/y location of dialogs to ensure when opened appear in visible window area

## ShadowMUD

- `Backup save` what to save when using remote backup systems
  - `Settings` Backup settings
  - `Profiles` Backup all profiles
  - `Map` Backup map data
  - `Windows` Backup window state data
- `Backup load` what to load when using remote backup systems
  - `Settings` Replace current settings with backed up settings
  - `Profiles` Restore profiles and replace any of same name
  - `Map` Restore map data, see Mapper backup import type for how it is imported
  - `Windows` Restore window states, **Note** if windows opened old states may replace new
- `Skip more prompt` Attempt to skip the more prompt after a set period of time
- `Skip more prompt delay` The amount of time in milliseconds to wait before skipping more prompt
- `Mapper backup import type` determines how mapper imports loaded data
- `Open ShadowMUD help in new window` Open the ShadowMUD help in a browser window, if disabled will open in dialog
- `Reset help dialog state` Reset the help dialog state, **Note** if dialog open will reuse active state on close
