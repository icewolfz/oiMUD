
# FAQ

## I am having trouble with the client, what do I do?

You should always make sure you have the latest updates, clear cache, refresh to see if issue is fixed.
If you are getting garbled or missing text try disabling MCCP, MXP, or UTF-8 in the [Telnet settings](preferences.md#telnet) then disconnect and reconnect, if still happens try clearing cache and refreshing

## Error when connecting

Try reconnecting, check to ensure no extensions are blocking the attempt, check your site settings in case security permissions are blocking it

## I am getting 'TypeError - some message. ', what does it mean?

This means there is an error, most of the time the error is from a broken profile item with bad or invalid javascript, can view error log in about dialog

## A window/dialog is not shown?

This means there is a chance the window is being opened off screen due to change in window size, using backups from a different computer with different screen sizes, or similar issues, if this happens you can clear all window states in the preferences by clicking the 'Reset Windows' to clear all window states when the settings are saved. If you have used backup system from the mud there is also an [advanced setting](preferences.md#Advanced) to ignore saving window states. Lastly you can manually edit the settings file window state data to adjust the window data, this has to be done when dialog/window is not loaded or it will just override the data with new state data, all window states are stored in client options, clinet.getOption('windows.WINDOWNAME') and setOptions to set, you can try client.options in dev tools to get a list of most loaded options

## If your question is not listed

Open an issue about it or log on to [ShadowMUD](http://www.shadowmud.com) using a desktop client

## Setting keys, value type and default value

| Setting                           | Type          | Default                           |
|-----------------------------------|---------------|-----------------------------------|
| bufferSize                        | integer       | 5000                              |
| commandDelay                      | integer       | 500                               |
| commandDelayCount                 | integer       | 5                                 |
| commandHistorySize                | integer       | 20                                |
| fontSize                          | string        | 1em                               |
| cmdfontSize                       | string        | 1em                               |
| commandEcho                       | boolean       | true                              |
| flashing                          | boolean       | false                             |
| autoConnect                       | boolean       | true                              |
| enableAliases                     | boolean       | true                              |
| enableTriggers                    | boolean       | true                              |
| enableMacros                      | boolean       | true                              |
| showScriptErrors                  | boolean       | false                             |
| commandStacking                   | boolean       | true                              |
| commandStackingChar               | string        | ;                                 |
| htmlLog                           | boolean       | true                              |
| keepLastCommand                   | boolean       | true                              |
| enableMCCP                        | boolean       | true                              |
| enableUTF8                        | boolean       | true                              |
| font                              | string        | 'Courier New', Courier, monospace |
| cmdfont                           | string        | 'Courier New', Courier, monospace |
| mapFollow                         | boolean       | true                              |
| mapEnabled                        | boolean       | true                              |
| MapperSplitArea                   | boolean       | false                             |
| MapperFillWalls                   | boolean       | false                             |
| MapperOpen                        | boolean       | false                             |
| fullScreen                        | string        | false                             |
| enableMXP                         | boolean       | true                              |
| enableMSP                         | boolean       | true                              |
| parseCommands                     | string        | true                              |
| lagMeter                          | boolean       | false                             |
| enablePing                        | boolean       | false                             |
| enableEcho                        | boolean       | true                              |
| enableSpeedpaths                  | boolean       | true                              |
| speedpathsChar                    | string        | !                                 |
| parseSpeedpaths                   | boolean       | true                              |
| parseSingleQuotes                 | boolean       | false                             |
| parseDoubleQuotes                 | boolean       | true                              |
| logEnabled                        | boolean       | false                             |
| logPrepend                        | boolean       | false                             |
| logOffline                        | boolean       | false                             |
| logUniqueOnConnect                | boolean       | true                              |
| enableURLDetection                | boolean       | true                              |
| notifyMSPPlay                     | boolean       | false                             |
| CommandonClick                    | boolean       | true                              |
| allowEval                         | boolean       | true                              |
| allowEscape                       | boolean       | true                              |
| AutoCopySelectedToClipboard       | boolean       | false                             |
| enableDebug                       | boolean       | false                             |
| editorPersistent                  | boolean       | false                             |
| askonclose                        | boolean       | true                              |
| dev                               | boolean       | false                             |
| chat.captureLines                 | boolean       | false                             |
| chat.captureAllLines              | boolean       | false                             |
| chat.captureReviews               | boolean       | false                             |
| chat.captureTells                 | boolean       | false                             |
| chat.captureTalk                  | boolean       | false                             |
| chat.gag                          | boolean       | false                             |
| chat.CaptureOnlyOpen              | boolean       | false                             |
| checkForUpdates                   | boolean       | false                             |
| autoCreateCharacter               | boolean       | false                             |
| askonchildren                     | boolean       | true                              |
| mapper.legend                     | boolean       | false                             |
| mapper.room                       | boolean       | false                             |
| mapper.importType                 | integer       | 1                                 |
| mapper.vscroll                    | integer       | 0                                 |
| mapper.hscroll                    | integer       | 0                                 |
| mapper.scale                      | float         | 1.0                               |
| mapper.alwaysOnTop                | boolean       | false                             |
| mapper.alwaysOnTopClient          | boolean       | true                              |
| mapper.memory                     | boolean       | false                             |
| mapper.memorySavePeriod           | integer       | 900000                            |
| mapper.active.ID                  | string        | null                              |
| mapper.active.x                   | integer       | 0                                 |
| mapper.active.y                   | integer       | 0                                 |
| mapper.active.z                   | integer       | 0                                 |
| mapper.active.area                | string        | null                              |
| mapper.active.zone                | integer       | 0                                 |
| mapper.persistent                 | boolean       | true                              |
| profiles.split                    | integer       | -1                                |
| profiles.askoncancel              | boolean       | true                              |
| profiles.triggersAdvanced         | boolean       | false                             |
| profiles.aliasesAdvanced          | boolean       | false                             |
| profiles.buttonsAdvanced          | boolean       | false                             |
| profiles.macrosAdvanced           | boolean       | false                             |
| profiles.contextsAdvanced         | boolean       | false                             |
| profiles.codeEditor               | boolean       | true                              |
| profiles.watchFiles               | boolean       | true                              |
| chat.alwaysOnTop                  | boolean       | false                             |
| chat.alwaysOnTopClient            | boolean       | true                              |
| chat.log                          | boolean       | false                             |
| chat.persistent                   | boolean       | false                             |
| chat.zoom                         | integer       | 1                                 |
| chat.font                         | string        | 'Courier New', Courier, monospace |
| chat.fontSize                     | string        | 1em                               |
| title                             | string        | $t                                |
| logGagged                         | boolean       | false                             |
| logTimeFormat                     | string        | YYYYMMDD-HHmmss                   |
| autoConnectDelay                  | integer       | 600                               |
| autoLogin                         | boolean       | true                              |
| onDisconnect                      | integer       | 2                                 |
| enableKeepAlive                   | boolean       | false                             |
| keepAliveDelay                    | integer       | 0                                 |
| newlineShortcut                   | integer       | 1                                 |
| logWhat                           | integer       | 1                                 |
| logErrors                         | boolean       | true                              |
| showErrorsExtended                | boolean       | false                             |
| reportCrashes                     | boolean       | false                             |
| enableCommands                    | boolean       | true                              |
| commandChar                       | string        | #                                 |
| escapeChar                        | string        | \                                 |
| enableVerbatim                    | boolean       | true                              |
| verbatimChar                      | string        | `                                 |
| soundPath                         | string        | {data}\sounds                     |
| logPath                           | string        | {data}\logs                       |
| theme                             | string        | {themes}\default                  |
| gamepads                          | boolean       | false                             |
| buttons.connect                   | boolean       | true                              |
| buttons.characters                | boolean       | true                              |
| buttons.preferences               | boolean       | true                              |
| buttons.log                       | boolean       | true                              |
| buttons.clear                     | boolean       | true                              |
| buttons.lock                      | boolean       | true                              |
| buttons.map                       | boolean       | true                              |
| buttons.user                      | boolean       | true                              |
| buttons.mail                      | boolean       | true                              |
| buttons.compose                   | boolean       | true                              |
| buttons.immortal                  | boolean       | true                              |
| buttons.codeEditor                | boolean       | false                             |
| find.case                         | boolean       | false                             |
| find.word                         | boolean       | false                             |
| find.reverse                      | boolean       | false                             |
| find.regex                        | boolean       | false                             |
| find.selection                    | boolean       | false                             |
| find.show                         | boolean       | false                             |
| display.split                     | boolean       | false                             |
| display.splitHeight               | integer       | -1                                |
| display.splitLive                 | boolean       | true                              |
| display.roundedOverlays           | boolean       | true                              |
| backupLoad                        | integer       | 14                                |
| backupSave                        | integer       | 14                                |
| backupAllProfiles                 | boolean       | true                              |
| scrollLocked                      | boolean       | false                             |
| showStatus                        | boolean       | true                              |
| showCharacterManager              | boolean       | false                             |
| showChat                          | boolean       | false                             |
| showEditor                        | boolean       | false                             |
| showArmor                         | boolean       | false                             |
| showStatusWeather                 | boolean       | true                              |
| showStatusLimbs                   | boolean       | true                              |
| showStatusHealth                  | boolean       | true                              |
| showStatusExperience              | boolean       | true                              |
| showStatusPartyHealth             | boolean       | true                              |
| showStatusCombatHealth            | boolean       | true                              |
| showButtonBar                     | boolean       | true                              |
| allowNegativeNumberNeeded         | boolean       | false                             |
| spellchecking                     | boolean       | true                              |
| hideOnMinimize                    | boolean       | false                             |
| showTrayIcon                      | boolean       | false                             |
| statusExperienceNeededProgressbar | boolean       | false                             |
| trayClick                         | integer       | 1                                 |
| trayDblClick                      | integer       | 0                                 |
| pasteSpecialPrefix                | string        |                                   |
| pasteSpecialPostfix               | string        |                                   |
| pasteSpecialReplace               | string        |                                   |
| pasteSpecialPrefixEnabled         | boolean       | true                              |
| pasteSpecialPostfixEnabled        | boolean       | true                              |
| pasteSpecialReplaceEnabled        | boolean       | true                              |
| display.showSplitButton           | boolean       | true                              |
| chat.split                        | boolean       | false                             |
| chat.splitHeight                  | integer       | -1                                |
| chat.splitLive                    | boolean       | true                              |
| chat.roundedOverlays              | boolean       | true                              |
| chat.showSplitButton              | boolean       | true                              |
| chat.bufferSize                   | integer       | 5000                              |
| chat.flashing                     | boolean       | false                             |
| display.hideTrailingEmptyLine     | boolean       | true                              |
| display.enableColors              | boolean       | true                              |
| display.enableBackgroundColors    | boolean       | true                              |
| enableSound                       | boolean       | true                              |
| allowHalfOpen                     | boolean       | true                              |
| editorClearOnSend                 | boolean       | true                              |
| editorCloseOnSend                 | boolean       | true                              |
| askOnCloseAll                     | boolean       | true                              |
| askonloadCharacter                | boolean       | true                              |
| mapper.roomWidth                  | integer       | 200                               |
| mapper.roomGroups                 | integer flag  | 7                                 |
| mapper.showInTaskBar              | boolean       | false                             |
| profiles.enabled                  | string array  | []                                |
| profiles.sortOrder                | integer flag  | 12                                |
| profiles.sortDirection            | integer       | 1                                 |
| profiles.showInTaskBar            | boolean       | false                             |
| profiles.profileSelected          | string        | default                           |
| profiles.profileExpandSelected    | boolean       | true                              |
| chat.lines                        | string array  | []                                |
| chat.showInTaskBar                | boolean       | false                             |
| chat.showTimestamp                | boolean       | false                             |
| chat.timestampFormat              | string        | [[]MM-DD HH:mm:ss.SSS[]]          |
| chat.tabWidth                     | integer       | 8                                 |
| chat.displayControlCodes          | boolean       | false                             |
| chat.emulateTerminal              | boolean       | false                             |
| chat.emulateControlCodes          | boolean       | true                              |
| chat.wordWrap                     | boolean       | false                             |
| chat.wrapAt                       | integer       | 0                                 |
| chat.indent                       | integer       | 4                                 |
| chat.scrollLocked                 | boolean       | false                             |
| chat.find.case                    | boolean       | false                             |
| chat.find.word                    | boolean       | false                             |
| chat.find.reverse                 | boolean       | false                             |
| chat.find.regex                   | boolean       | false                             |
| chat.find.selection               | boolean       | false                             |
| chat.find.show                    | boolean       | false                             |
| chat.find.highlight               | boolean       | false                             |
| chat.find.location                | integer array | [5, 20]                           |
| codeEditor.showInTaskBar          | boolean       | false                             |
| codeEditor.persistent             | boolean       | false                             |
| codeEditor.alwaysOnTop            | boolean       | false                             |
| codeEditor.alwaysOnTopClient      | boolean       | true                              |
| autoTakeoverLogin                 | boolean       | false                             |
| fixHiddenWindows                  | boolean       | true                              |
| maxReconnectDelay                 | integer       | 3600                              |
| enableBackgroundThrottling        | boolean       | true                              |
| enableBackgroundThrottlingClients | boolean       | false                             |
| showInTaskBar                     | boolean       | true                              |
| showLagInTitle                    | boolean       | false                             |
| mspMaxRetriesOnError              | integer       | 0                                 |
| logTimestamp                      | boolean       | false                             |
| logTimestampFormat                | string        | [[]MM-DD HH:mm:ss.SSS[]]          |
| disableTriggerOnError             | boolean       | true                              |
| prependTriggeredLine              | boolean       | true                              |
| enableParameters                  | boolean       | true                              |
| parametersChar                    | string        | %                                 |
| enableNParameters                 | boolean       | true                              |
| nParametersChar                   | string        | $                                 |
| enableParsing                     | boolean       | true                              |
| externalWho                       | boolean       | true                              |
| externalHelp                      | boolean       | true                              |
| watchForProfilesChanges           | boolean       | false                             |
| onProfileChange                   | integer       | 0                                 |
| onProfileDeleted                  | integer       | 0                                 |
| enableDoubleParameterEscaping     | boolean       | false                             |
| ignoreEvalUndefined               | boolean       | true                              |
| enableInlineComments              | boolean       | true                              |
| enableBlockComments               | boolean       | true                              |
| inlineCommentString               | string        | //                                |
| blockCommentString                | string        | /*                                |
| allowCommentsFromCommand          | boolean       | false                             |
| saveTriggerStateChanges           | boolean       | true                              |
| groupProfileSaves                 | boolean       | false                             |
| groupProfileSaveDelay             | integer       | 20000                             |
| returnNewlineOnEmptyValue         | boolean       | false                             |
| pathDelay                         | integer       | 0                                 |
| pathDelayCount                    | integer       | 1                                 |
| echoSpeedpaths                    | boolean       | false                             |
| alwaysShowTabs                    | boolean       | false                             |
| scriptEngineType                  | integer       | 4                                 |
| initializeScriptEngineOnLoad      | boolean       | false                             |
| find.highlight                    | boolean       | false                             |
| find.location                     | integer array | [5, 20]                           |
| display.showInvalidMXPTags        | boolean       | false                             |
| display.showTimestamp             | boolean       | false                             |
| display.timestampFormat           | string        | [[]MM-DD HH:mm:ss.SSS[]]          |
| display.displayControlCodes       | boolean       | false                             |
| display.emulateTerminal           | boolean       | false                             |
| display.emulateControlCodes       | boolean       | true                              |
| display.wordWrap                  | boolean       | false                             |
| display.tabWidth                  | integer       | 8                                 |
| display.wrapAt                    | integer       | 0                                 |
| display.indent                    | integer       | 4                                 |
| statusWidth                       | integer       | -1                                |
| showEditorInTaskBar               | boolean       | true                              |
| trayMenu                          | integer       | 0                                 |
| lockLayout                        | boolean       | false                             |
| loadLayout                        | string        |                                   |
| useSingleInstance                 | boolean       | true                              |
| onSecondInstance                  | integer       | 1                                 |
| characterManagerDblClick          | integer       | 2                                 |
| enableTabCompletion'              | boolean       | true                              |
| ignoreCaseTabCompletion           | boolean       | false                             |
| tabCompletionBufferLimit          | integer       | 100                               |
| enableNotifications               | boolean       | true                              |
| echo                              | integer flag  | 0                                 |
| commandAutoSize                   | boolean       | false                             |
| commandWordWrap                   | boolean       | false                             |
| commandScrollbars                 | boolean       | false                             |
| tabCompletionList                 | string        |                                   |
| tabCompletionLookupType           | integer       | 1                                 |
| tabCompletionReplaceCasing        | integer       | 0                                 |
| characterManagerAddButtonAction   | integer       | 0                                 |
| enableCrashReporting              | boolean       | false                             |
| characterManagerPanelWidth        | number        | 0                                 |
| ignoreInputLeadingWhitespace      | boolean       | false                             |

### trayClick and trayDblClick values

Value | Results
------|------------------
0     | do nothing
1     | show active window and client
2     | hide active window and client
3     | toggle show/hide active window and client
4     | show menu
5     | show all windows
6     | hide all windows
7     | toggle all windows

### onDisconnect values

Value | Results
------|------------------------
0     | Do nothing
1     | Attempt to reconnect
2     | Open reconnect dialog
4     | Open character manager
8     | Close client

### newlineShortcut values

Value | Results
------|-----------------------------------------
0     | Nothing
1     | ctrl + enter appends newline
2     | shift + enter appends newline
4     | ctrl or shift + enter appends newline
8     | ctrl and shift + enter appends new line

### logWhat

Value | Results
------|----------
0     | Nothing
1     | Log HTML
2     | Log Text
4     | Log Raw

To load more then one type simple add the numbers together, for example to load as HTML and text you would use the value of 3, HTML + raw would be 5, all would be 7

### backupLoad and backupSave values

Value | Results
------|----------
0     | Nothing
2     | Map data
4     | Profiles
8     | Settings
16    | Windows

To pick more then 1 type simple add them 2 values together, eg
2 + 4 = 6 to backup map and profiles only, 14 will load or save all

### echo

Value | Results
------|----------
0     | None
8     | Triggers
2     | Scripts
4     | Commands

To pick more then one add the numbers togather

### tabCompletionLookupType

Value | Results
------|----------
1     | PrependBuffer
2     | AppendBuffer
4     | BufferOnly
8     | List

### characterManagerDblClick

Value | Results
------|----------
1     | OpenTab
2     | NewTab
4     | NewWindow
8     | Global **note:** this would be the same as if it just inherits

### onSecondInstance

Value | Results
------|----------
0     | Nothing
1     | Show
2     | NewConnection
4     | NewWindow 

### trayMenu

Value | Results
------|----------
0     | simple
1     | full
2     | compact

### scriptEngineType

Value | Results
------|----------
1     | Full
2     | Fast
4     | Simple

### onProfileChange or onProfileDeleted

Value | Results
------|----------
0     | Nothing
1     | Reload
2     | Ask
4     | Warn

### profiles.sortOrder

Value | Results
------|----------
0     | None
2     | Alpha
4     | Priority
8     | Index

Add to numbers together to pick more then one