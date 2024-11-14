# Profile manager

## Breadcrumb

The navigation breadcrumb to allow easier jumping to other pages

## Main interface

- `Left panel` List of all profiles
- `Right panel` Current item editor

## Footer buttons
- `Back` Go back one page, not visible on main list view
- `Show menu` Show the profile dialog menu
- `Add profile/item` Add new profile or item depending on current page
- `Remove profile/item` Remove current selected profil or iteme, can not remove Default profile
- `Apply` Apply changes without closing dialog
- `Save` Save changes and close dialog
- `Cancel` Close dialog and ask to save any changes

## Profile menu

- `Add profile` Add a new profile with default macros
- `Add empty profile` Add a new profile with no default items
- `Add alias` Add new alias
- `Add macro` Add new macro
- `Add trigger` Add new trigger
- `Add button` Add new button
- `Add default buttons` Add default buttons to current profile
- `Add default macros` Add default macros to current profile
- `Export current profile` Export current profile
- `Export profiles` Export all profiles as one file
- `Import` import profiles
- `Refresh` Refresh manager 

## Profiles

- `Enable` Enable profile, one profile must always be enabled
- `Enable Aliases` Enable/disable aliases from being executed before text is sent to the mud. for the selected profile
- `Enable Macros` enable/disable keyboard macros when keys are key combinations are pressed for the selected profile
- `Enable Triggers` Enable/disable triggers from being executed as text is received or sent to the mud for the selected profile
- `Enable Buttons` Enable/disable buttons
- `Priority` The profile's priority, this allows you to control the order in which profiles are sorted when executing aliases, triggers and macros in case of duplicate names
- `Manage [item]` Open list to manage items

## Aliases

- `Enabled` enable/disable selected alias
- `Name` the name of the alias, this is used to execute an alias
- `Style` how the value is processed
  - `Text` send value as is
  - `Parse` do standard parsing, allows %0 ... %n to access arguments, or %name or $name, [may use alterative ${}/%{} block syntax](functions.md)
  - `Script` the value is javascript, it will evaluate and any thing returned will be sent to the mud. the value is wrapped as a function and any matched patterns are passed as arguments, use standard arguments[#] to access.
- `Value` the value to send to the mud

### Aliases advanced

- `Params` this allows you to name arguments in a comma delimited list, each word in the list is the same as the %# and accessed using $name, ${name}, or %{name}, Naming convention use javascript identifier rules, which are must be at least 1 character of a-z,A-Z,$, or _ followed by a-z,A-Z,$,_, or 0 - 9, and not a javascript keyword
- `Priority` the sort order of aliases
- `Append arguments` append any unused arguments to the end of the value before sending to the mud
- `Multi` this allows you to have aliases of all the same name, and if false to stop executing on this alias

## Macros

- `Enabled` enable/disable selected macro
- `Key` The key to press to run macro
- `Modifies` Macro key modifiers to combine with key to run macro
- `Style` how the value is processed
  - `Text` send value as is
  - `Parse` do standard parsing
  - `Script` the value is javascript, it will evaluate and any thing returned will be sent to the mud. the value is wrapped as a function and any matched patterns are passed as arguments, use standard arguments[#] to access.
- `Value` the value to send to the mud

### Macros advanced

- `Name` a simple descriptive name for easy identifying when editing macros
- `Send to Mud` send the value to the mud
- `Append to Command` append value to the end of the command input
- `Daisy Chain` this will append the value to the command line if it ends with a space then send the command line to the mud, if no space it will be handled as a standard macro and send the value.

## Triggers

- `Enabled` enable/disable selected trigger
- `Pattern` the pattern to match against
  - `Edit` Open multi line pattern editor
  - `Drop down` Select which trigger state to edit, **only visible when multiple states are created**
  - `Add trigger state` Add a new trigger state to current trigger making a multi state trigger, see [Multi state triggers](profiles.md#multi-state-triggers)
  - `Remove trigger state` Remove the current trigger state, only enabled if multiple states,**only visible when multiple states are created**
- `Style` how the value is processed
  - `Text` send value as is
  - `Parse` do standard parsing, allows %0 ... %n to access arguments regex matches, [may use alterative ${}/%{} block syntax](functions.md)
  - `Script` the value is javascript, it will evaluate and any thing returned will be sent to the mud, the value is wrapped as a function and any matched patterns are passed as arguments, use standard arguments[#] to access.
- `Value` the value to send to the mud
- `Test` Allows you to test your pattern against a string and return results and any arguments found
  - `Text` the text to test pattern against.
  - `Results` the results of the test, either no match or a list of arguments found.

### Triggers advanced

- `Type` the type of trigger
  - `Regular Expression` use javascript regular expressions when matching the pattern against text, allowed named capturing as, $name, %{name} or ${name}, Naming convention use javascript identifier rules, which are must be at least 1 character of a-z,A-Z,$, or _ followed by a-z,A-Z,$,_, or 0 - 9, and not a javascript keyword
    - Example: (?\<name>.\*) says: (?\<message>.*) will store first group as name, and second as message
      - Access as passe type: %1, \${1}, \%{1}, \${name}, \%{name}, \$name, %1, \${1}, %{1}, $message, \${message}, %{message}
      - Access as script type: arguments[1], name, arguments[2], message
  - `Command Input Regular Expression` same as Regular Expression but only triggered against text sent from the command input.
  - `Event` fired when pattern matches an event name, either a custom name or built in:
    - `opened` fired when client has finished opening
    - `closed` fired when client is closing
    - `connected` fired when client has been connected
    - `disconnected` fired when client has been disconnected
    - `error` fired when an error happens, first first argument is error message
    - `focus` fired when window focused
    - `blur` fired when window loses focus
    - `notify-clicked` fired when notification is clicked
      - argument 1 is title
      - argument 2 is message
    - `notify-closed` fired when notification is closed
      - argument 1 is title
      - argument 2 is message    
    - `backup-loaded` fired when backup has finished loading
    - `backup-saved` fired when backup has finished saving
  - `Alarm` create repeating tick timers
    ```
    When using alarm type pattern is in the format of hours:minutes:seconds, where hours and minutes are optional. A asterisk (*) is a wildcard to match any value for that place, if minutes or hours are missing a * is assumed. If pattern is preceded with a minus (-) the connection time is used instead of current time.

    You can also define a temporary, one time alarm if pattern is preceded with a plus (+), the trigger alarm is executed then deleted.

    Hours are defined in 24 hour format of 0 to 23, minutes and seconds are 0 to 59.
    If seconds are > 59 and the only pattern it will be considered the same as adding a wildcard (*) in front of the number.

    Hours, minutes, and seconds can use a special wildcard format of *value which will match when the time MOD is zero, eg: *10 matches 10, 20, ...
    ```
  - `Pattern` use zMUD style pattern matching when matching against text
  - `Command Input Pattern` use zMUD style pattern matching but only triggered against text sent from the command input.
    - `*` match any number (even none) of characters or white space
    - `?` match a single character
    - `%d` match any number of digits (0-9)
    - `%n` match a number that starts with a + or - sign
    - `%w` match any number of alpha characters (a-z) (a word)
    - `%a` match any number of alphanumeric characters (a-z,0-9)
    - `%s` match any amount of white space (spaces, tabs)
    - `%x` match any amount of non-white space
    - `%y` match any amount of non-white space (same as %x but matches start and end of line)
    - `%p` match any punctuation
    - `%q` match any punctuation (same as %p but matches start and end of line)
    - `%t` match a direction command, ignored as not supported
    - `%e` match ESC character for ansi patterns
    - `[range]` match any amount of characters listed in range
    - `^` force pattern to match starting at the beginning of the line
    - `$` force pattern to match ending at the end of the line
    - `(pattern)` save the matched pattern in a parameter %1 though %99
    - `~` quote the next character to prevent it to be interpreted as a wild card, required to match special characters
    - `~~` match a quote character verbatim
    - `{val1|val2|val3|...}` match any of the specified strings a preference controls the use of wildcards here
    - `@variable` match any of the specified strings or keys words with variable value
    - `{^string}` do not match the specified string
    - `&nn` matches exactly nn characters (fixed width pattern)
    - `&VarName` assigns the matched string to the given variable
    - `%/regex/%` matches the given Regular Expression
  - `Loop Expression` execute every line as long as expression is true, setting param to # will set the max number of lines allowed to loop, **WARNING** It is very easy to get stuck in an infinite loop if the trigger returns or displays text to the screen, if you use a param you will have to reset the trigger state using [#STATE](commands.md#triggers) if not a multi state trigger
  - Sub triggers Only types:
    - `Skip` Skip N lines before trigger will fire, set param to # of lines to skip
    - `Wait` Waits a set amount of milliseconds before trigger will fire on matched pattern, set param to # of milliseconds to wait
    - `Loop Pattern` Trigger N # of times before moving to next trigger state, set param to # of times to match
    - `Loop Lines` Fire trigger within N # of lines of all matching lines, after N # lines advance state
    - `Duration` Will only fire if matched line arrives in the amount of time between the last state fired and the duration, set param to # of milliseconds
    - `Within Lines` Fire trigger with in N # of lines, if not triggered after N lines state advances to next state, set param to # of lines to match with in
    - `Manual` Manual state that is only fired using [#SET](commands.md#triggers) command
    - `ReParse` Re-parse the last line using the new regular expression patterns, if pattern matches executes normally, if does not match it advances to next state
    - `ReParse Pattern` Re-parse the last line using the new zmud pattern, if pattern matches executes normally, if does not match it advances to next state
- `Name` a unique name to identify the trigger, if more then one trigger exist with the name, the one with the highest priority is used first
- `Priority` the sort order of triggers, if multi state trigger only the 0 state supports Priority
- `State` if multi state trigger this sets the current state to begin triggering
- `Param` parameters for the selected trigger type if supported
- `Verbatim` the text is compared exactly how it is, including case
- `Temporary` the trigger will be deleted on first execution
- `Case sensitive` causes trigger to make sure letter cases are matched, eg A equal A and not a, off A equal a or A
- `Trigger on Newline` this causes the trigger to execute if it is a full line of text
- `Trigger on Prompt` this causes the trigger to execute if prompt/partial line of text.
- `Trigger on raw` this causes the trigger to match the raw text of the line including any ansi escape codes, you can use \x1b or \u001b in pattern for escape code, eg \1x\[0m would match the ansi bold sequence

### Multi state triggers

Multi state triggers are an advanced form of triggers that let you chain or trigger based on multiple conditions, you can add as many states you like and rearrange them as needed and mix any of the supported trigger types. Each state is a full trigger allowing for total control on how each state will work, the `Priority` and `State` options only exist on the primary 0 state. You can edit each state by selecting the state you want to edit from the drop down menu from the pattern input box, this is also where you can rearrange patterns using the move up or down button for each displayed state. All disabled states will be skipped.

Temporary states will be removed from the trigger after being executed and shift all other states down, if last state the entire trigger will be removed as normal Temporary trigger

## Buttons

- `Enabled` enable/disable button
- `Caption` The button caption to display for tooltip
- `Icon` A path to an icon to display, supports font awesome 6, value url, or bootstrap icons, **Note** Only free font awesome icons are supported
  - `bi-[ICON]` [Bootstrap icons](https://icons.getbootstrap.com)
  - `fa-[ICON]` - font awesome solid icon [Font awesome icons](https://fontawesome.com/icons)
  - `far-[ICON]` - font awesome regular icon
  - `fas-[ICON]` - same as fa-
  - `fab-[ICON]` - font awesome brand icon
  - `fal-[ICON]` - font awesome light icon
  - `fat-[ICON]` - font awesome thin icon
- `Icon only` Only display icon and use Caption as tooltip
- `Style` how the value is processed
  - `Text` send value as is
  - `Parse` do standard parsing
  - `Script` the value is javascript, it will evaluate and any thing returned will be sent to the mud. the value is wrapped as a function and any matched patterns are passed as arguments, use standard arguments[#] to access.
- `Value` the value to send to the mud

### Buttons advanced

- `Name` allows accessing the button from javascript using $(#name)
- `Priority` the sort order of buttons when created
- `Send to Mud` send the value to the mud
- `Append to Command` append value to the end of the command input
- `Daisy Chain` this will append the value to the command line if it ends with a space then send the command line to the mud, if no space it will be handled as a standard macro and send the value.


### Buttons size

- `Width` Button width
- `Height` Button height

A value of 0 will attempt to auto size based on position and caption

### Buttons Position

- `Top` The position from the top edge of client screen
- `Left` The position from the left edge of client screen
- `Right` The position from the right edge of client screen
- `Bottom` The position from the bottom edge of client screen

A value of -1 will auto position that side, -1 for all sides will auto position based on the right edge


