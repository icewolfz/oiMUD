//spell-checker:words vscroll, hscroll, askoncancel, askonclose,commandon, cmdfont
//spell-checker:ignore emoteto, emotetos askonchildren YYYYMMDD Hmmss
import { NewLineType, OnDisconnect, ProfileSortOrder, OnProfileChange, OnProfileDeleted, ScriptEngineType, SettingType, Echo, TabCompletion } from './types';
import { isMobile } from './library'

/**
 * Array that contains details about setting values
 * [settingKey, object property, setting data type, default value, max length
 *
 * settingKey - unique key value, object property value if object property undefined, 0 or null
 * object property - the value used to access setting if settingKey is not property, can use . to denote nested properties
 * setting data type - the data type of setting
 *      0 string
 *      1 boolean
 *      2 number
 *      3 raw setting
 *      4 custom
 *      5 combo-box
 * default value - the default value of setting
 * max length - optional max length
 */
export let SettingList: any[] = [
    ['bufferSize', 0, 2, 500],
    ['commandDelay', 0, 2, 500],
    ['commandDelayCount', 0, 2, 5],
    ['commandHistorySize', 0, 2, 20],
    ['fontSize', 0, 0, '1em', 0],
    ['cmdfontSize', 0, 0, '1em', 0],
    ['commandEcho', 0, 1, true],
    ['flashing', 0, 1, false],
    ['autoConnect', 0, 1, true],
    ['enableAliases', -1, 1, true],
    ['enableTriggers', -1, 1, true],
    ['enableMacros', -1, 1, true],
    ['showScriptErrors', 0, 1, false],
    ['commandStacking', 0, 1, true],
    ['commandStackingChar', 0, 0, ';', 1],
    ['htmlLog', 0, 1, true],
    ['keepLastCommand', 0, 1, true],
    ['enableMCCP', 0, 1, true],
    ['enableUTF8', 0, 1, true],
    ['font', 0, 5, '\'Courier New\', Courier, monospace', 0],
    ['cmdfont', 0, 5, '\'Courier New\', Courier, monospace', 0],
    ['aliases', -1, 4],
    ['macros', -1, 4],
    ['triggers', -1, 4],
    ['mapFollow', 'mapper.follow', 1, true],
    ['mapEnabled', 'mapper.enabled', 1, true],
    ['MapperSplitArea', 'mapper.split', 1, false],
    ['MapperFillWalls', 'mapper.fill', 1, false],
    ['MapperOpen', 'showMapper', 1, false],
    ['fullScreen', -1, 3, false],
    ['enableMXP', 0, 1, true],
    ['enableMSP', 0, 1, true],
    ['parseCommands', 0, 3, true],
    ['lagMeter', 0, 1, true],
    ['enablePing', 0, 1, false],
    ['enableEcho', 0, 1, true],
    ['enableSpeedpaths', 0, 1, true],
    ['speedpathsChar', 0, 0, '!', 1],
    ['parseSpeedpaths', 0, 1, true],
    ['profile', -1, 0, 'Default', 1],
    ['parseSingleQuotes', 0, 1, false],
    ['parseDoubleQuotes', 0, 1, true],
    ['logEnabled', 0, 1, false],
    ['logPrepend', 0, 1, false],
    ['logOffline', 0, 1, false],
    ['logUniqueOnConnect', 0, 1, true],
    ['enableURLDetection', 0, 1, true],
    ['colors', 0, 4],
    ['notifyMSPPlay', 0, 1, false],
    ['CommandonClick', 0, 1, true],
    ['allowEval', 0, 1, true],
    ['allowEscape', 0, 1, true],
    ['AutoCopySelectedToClipboard', 0, 1, false],
    ['enableDebug', 0, 1, false],
    ['editorPersistent', 0, 1, false],
    ['askonclose', 0, 1, true],
    ['dev', 0, 1, false],
    //New settings
    ['chat.captureLines', 0, 1, false],
    ['chat.captureAllLines', 0, 1, false],
    ['chat.captureReviews', 0, 1, false],
    ['chat.captureTells', 0, 1, false],
    ['chat.captureTalk', 0, 1, false],
    ['chat.gag', 0, 1, false],
    ['chat.CaptureOnlyOpen', 0, 1, false],
    ['checkForUpdates', 0, 1, false],
    ['autoCreateCharacter', 0, 1, false],
    ['askonchildren', 0, 1, true],
    ['mapper.legend', 0, 1, false],
    ['mapper.room', 0, 1, false],
    ['mapper.importType', 0, 2, 1],
    ['mapper.vscroll', 0, 2, 0],
    ['mapper.hscroll', 0, 2, 0],
    ['mapper.scale', 0, 2, 100],
    ['mapper.alwaysOnTop', 0, 1, false],
    ['mapper.alwaysOnTopClient', 0, 1, true],
    ['mapper.memory', 0, 1, false],
    ['mapper.memorySavePeriod', 0, 2, 900000],
    ['mapper.active.ID', 0, 0, null],
    ['mapper.active.x', 0, 2, 0],
    ['mapper.active.y', 0, 2, 0],
    ['mapper.active.z', 0, 2, 0],
    ['mapper.active.area', 0, 0, null],
    ['mapper.active.zone', 0, 2, 0],
    ['mapper.persistent', 0, 1, true],
    ['profiles.split', 0, 2, 204],
    ['profiles.askoncancel', 0, 1, true],
    ['profiles.triggersAdvanced', 0, 1, false],
    ['profiles.aliasesAdvanced', 0, 1, false],
    ['profiles.buttonsAdvanced', 0, 1, false],
    ['profiles.macrosAdvanced', 0, 1, false],
    ['profiles.contextsAdvanced', 0, 1, false],
    ['profiles.codeEditor', 0, 1, true],
    ['profiles.watchFiles', 0, 1, true],
    ['chat.alwaysOnTop', 0, 1, false],
    ['chat.alwaysOnTopClient', 0, 1, true],
    ['chat.log', 0, 1, false],
    ['chat.persistent', 0, 1, false],
    ['chat.zoom', 0, 2, 1],
    ['chat.font', 0, 5, '\'Courier New\', Courier, monospace'],
    ['chat.fontSize', 0, 0, '1em'],
    ['title', 0, 0, '$t'],
    ['logGagged', 0, 1, false],
    ['logTimeFormat', 0, 0, 'YYYYMMDD-HHmmss'],
    ['autoConnectDelay', 0, 2, 600],
    ['autoLogin', 0, 1, true],
    ['onDisconnect', 0, 2, OnDisconnect.ReconnectDialog],
    ['enableKeepAlive', 0, 1, false],
    ['keepAliveDelay', 0, 2, 0],
    ['newlineShortcut', 0, 2, NewLineType.Ctrl],
    ['logWhat', 0, 2, 1],
    ['logErrors', 0, 1, true],
    ['showErrorsExtended', 0, 1, false],
    ['reportCrashes', 0, 1, false],
    ['enableCommands', 0, 1, true],
    ['commandChar', 0, 0, '#', 1],
    ['escapeChar', 0, 0, '\\', 1],
    ['enableVerbatim', 0, 1, true],
    ['verbatimChar', 0, 0, '`'],
    ['soundPath', 0, 0, ''],
    ['logPath', 0, 0, ''],
    ['theme', 0, 0, ''],
    ['gamepads', 0, 1, false],
    ['buttons.connect', 0, 1, true],
    ['buttons.characters', 0, 1, true],
    ['buttons.preferences', 0, 1, true],
    ['buttons.log', 0, 1, true],
    ['buttons.clear', 0, 1, true],
    ['buttons.lock', 0, 1, true],
    ['buttons.map', 0, 1, true],
    ['buttons.user', 0, 1, true],
    ['buttons.mail', 0, 1, false],
    ['buttons.compose', 0, 1, false],
    ['buttons.immortal', 0, 1, true],
    ['buttons.codeEditor', 0, 1, false],
    ['find.case', 0, 1, false],
    ['find.word', 0, 1, false],
    ['find.reverse', 0, 1, false],
    ['find.regex', 0, 1, false],
    ['find.selection', 0, 1, false],
    ['find.show', 0, 1, false],
    ['display.split', 0, 1, false],
    ['display.splitHeight', 0, 2, -1],
    ['display.splitLive', 0, 1, true],
    ['display.roundedOverlays', 0, 1, true],
    ['backupLoad', 0, 2, 30],
    ['backupSave', 0, 2, 30],
    ['backupAllProfiles', 0, 1, true],
    ['scrollLocked', 0, 1, false],
    ['showStatus', 0, 1, !isMobile()],
    ['showCharacterManager', 0, 1, false],
    ['showChat', 0, 1, false],
    ['showEditor', 0, 1, false],
    ['showArmor', 0, 1, false],
    ['showStatusWeather', 0, 1, true],
    ['showStatusLimbs', 0, 1, true],
    ['showStatusHealth', 0, 1, true],
    ['showStatusExperience', 0, 1, true],
    ['showStatusPartyHealth', 0, 1, true],
    ['showStatusCombatHealth', 0, 1, true],
    ['showButtonBar', 0, 1, true],
    ['allowNegativeNumberNeeded', 0, 1, false],
    ['spellchecking', 0, 1, true],
    ['hideOnMinimize', 0, 1, false],
    ['showTrayIcon', 0, 1, false],
    ['statusExperienceNeededProgressbar', 0, 1, false],
    ['trayClick', 0, 2, 0],
    ['trayDblClick', 0, 2, 0],
    ['pasteSpecialPrefix', 0, 0, ''],
    ['pasteSpecialPostfix', 0, 0, ''],
    ['pasteSpecialReplace', 0, 0, ''],
    ['pasteSpecialPrefixEnabled', 0, 1, true],
    ['pasteSpecialPostfixEnabled', 0, 1, true],
    ['pasteSpecialReplaceEnabled', 0, 1, true],
    ['display.showSplitButton', 0, 1, true],
    ['chat.split', 0, 1, false],
    ['chat.splitHeight', 0, 2, -1],
    ['chat.splitLive', 0, 1, true],
    ['chat.roundedOverlays', 0, 1, true],
    ['chat.showSplitButton', 0, 1, true],
    ['chat.bufferSize', 0, 2, 500],
    ['chat.flashing', 0, 1, false],
    ['display.hideTrailingEmptyLine', 0, 1, true],
    ['display.enableColors', 0, 1, true],
    ['display.enableBackgroundColors', 0, 1, true],
    ['enableSound', 0, 1, true],
    ['allowHalfOpen', 0, 1, true],
    ['editorClearOnSend', 0, 1, true],
    ['editorCloseOnSend', 0, 1, true],
    ['askOnCloseAll', 0, 1, true],
    ['askonloadCharacter', 0, 1, true],
    ['mapper.roomWidth', 0, 2, 200],
    ['mapper.roomGroups', 0, 2, 1 | 2 | 4],
    ['mapper.showInTaskBar', 0, 1, false],
    ['profiles.enabled', 0, 4, []],
    ['profiles.sortOrder', 0, 2, ProfileSortOrder.Priority | ProfileSortOrder.Index],
    ['profiles.sortDirection', 0, 2, 1],
    ['profiles.showInTaskBar', 0, 1, false],
    ['profiles.profileSelected', 0, 0, 'default'],
    ['profiles.profileExpandSelected', 0, 1, true],
    ['chat.lines', 0, 4, []],
    ['chat.showInTaskBar', 0, 1, false],
    ['chat.showTimestamp', 0, SettingType.Number, 0],
    ['chat.timestampFormat', 0, 0, '[[]MM-DD HH:mm:ss.SSS[]] '],
    ['chat.tabWidth', 0, 2, 8],
    ['chat.displayControlCodes', 0, 1, false],
    ['chat.emulateTerminal', 0, 1, false],
    ['chat.emulateControlCodes', 0, 1, true],
    ['chat.wordWrap', 0, 1, false],
    ['chat.wrapAt', 0, 2, 0],
    ['chat.indent', 0, 2, 4],
    ['chat.scrollLocked', 0, 1, false],
    ['chat.find.case', 0, 1, false],
    ['chat.find.word', 0, 1, false],
    ['chat.find.reverse', 0, 1, false],
    ['chat.find.regex', 0, 1, false],
    ['chat.find.selection', 0, 1, false],
    ['chat.find.show', 0, 1, false],
    ['chat.find.highlight', 0, 1, false],
    ['chat.find.location', 0, 4, [5, 20]],
    ['codeEditor.showInTaskBar', 0, 1, false],
    ['codeEditor.persistent', 0, 1, false],
    ['codeEditor.alwaysOnTop', 0, 1, false],
    ['codeEditor.alwaysOnTopClient', 0, 1, true],
    ['autoTakeoverLogin', 0, 1, false],
    ['fixHiddenWindows', 0, 1, true],
    ['maxReconnectDelay', 0, 2, 3600],
    ['enableBackgroundThrottling', 0, 1, true],
    ['enableBackgroundThrottlingClients', 0, 1, false],
    ['showInTaskBar', 0, 1, true],
    ['showLagInTitle', 0, 1, false],
    ['mspMaxRetriesOnError', 0, 2, 0],
    ['logTimestamp', 0, SettingType.Number, 0],
    ['logTimestampFormat', 0, 0, '[[]MM-DD HH:mm:ss.SSS[]] '],
    ['disableTriggerOnError', 0, 1, true],
    ['prependTriggeredLine', 0, 1, true],
    ['enableParameters', 0, 1, true],
    ['parametersChar', 0, 0, '%', 1],
    ['enableNParameters', 0, 1, true],
    ['nParametersChar', 0, 0, '$', 1],
    ['enableParsing', 0, 1, true],
    ['externalWho', 0, 1, true],
    ['externalHelp', 0, 1, true],
    ['watchForProfilesChanges', 0, 1, false],
    ['onProfileChange', 0, 2, OnProfileChange.Nothing],
    ['onProfileDeleted', 0, 2, OnProfileDeleted.Nothing],
    ['enableDoubleParameterEscaping', 0, 1, false],
    ['ignoreEvalUndefined', 0, 1, true],
    ['enableInlineComments', 0, 1, true],
    ['enableBlockComments', 0, 1, true],
    ['inlineCommentString', 0, 0, '//'],
    ['blockCommentString', 0, 0, '/*'],
    ['allowCommentsFromCommand', 0, 1, false],
    ['saveTriggerStateChanges', 0, 1, true],
    ['groupProfileSaves', 0, 1, false],
    ['groupProfileSaveDelay', 0, 2, 20000],
    ['returnNewlineOnEmptyValue', 0, 1, false],
    ['pathDelay', 0, 2, 0],
    ['pathDelayCount', 0, 2, 1],
    ['echoSpeedpaths', 0, 1, false],
    ['alwaysShowTabs', 0, 1, false],
    ['scriptEngineType', 0, SettingType.Number, ScriptEngineType.Simple],
    ['initializeScriptEngineOnLoad', 0, SettingType.Boolean, false],
    ['find.highlight', 0, SettingType.Boolean, false],
    ['find.location', 0, SettingType.Custom, [5, 20]],
    ['display.showInvalidMXPTags', 0, SettingType.Boolean, false],
    ['display.showTimestamp', 0, SettingType.Number, 0],
    ['display.timestampFormat', 0, SettingType.String, '[[]MM-DD HH:mm:ss.SSS[]] '],
    ['display.displayControlCodes', 0, SettingType.Boolean, false],
    ['display.emulateTerminal', 0, SettingType.Boolean, false],
    ['display.emulateControlCodes', 0, SettingType.Boolean, true],
    ['display.wordWrap', 0, SettingType.Boolean, false],
    ['display.tabWidth', 0, SettingType.Number, 8],
    ['display.wrapAt', 0, SettingType.Number, 0],
    ['display.indent', 0, SettingType.Number, 4],
    ['statusWidth', 0, SettingType.Number, -1],
    ['showEditorInTaskBar', 0, SettingType.Boolean, true],
    ['trayMenu', 0, SettingType.Number, 0],
    ['lockLayout', 0, SettingType.Boolean, false],
    ['loadLayout', 0, SettingType.String, ''],
    ['useSingleInstance', 0, SettingType.Boolean, true],
    ['onSecondInstance', 0, SettingType.Number, 0],
    ['characterManagerDblClick', 0, SettingType.Number, 0],
    ['enableTabCompletion', SettingType.Boolean, true],
    ['ignoreCaseTabCompletion', 0, SettingType.Boolean, false],
    ['tabCompletionBufferLimit', 0, SettingType.Number, 100],
    ['enableNotifications', 0, SettingType.Boolean, true],
    ['echo', 0, SettingType.Number, Echo.None],
    ['commandAutoSize', 0, SettingType.Boolean, false],
    ['commandWordWrap', 0, SettingType.Boolean, false],
    ['commandScrollbars', 0, SettingType.Boolean, false],
    ['tabCompletionList', 0, SettingType.String, ''],
    ['tabCompletionLookupType', 0, SettingType.Number, TabCompletion.PrependBuffer],
    ['tabCompletionReplaceCasing', 0, SettingType.Number, 0],
    ['characterManagerAddButtonAction', 0, SettingType.Number, 0],
    ['enableCrashReporting', 0, SettingType.Boolean, false],
    ['characterManagerPanelWidth', 0, SettingType.Number, 0],
    ['ignoreInputLeadingWhitespace', 0, SettingType.Boolean, false],
    ['profiles.find.case', 0, 1, false],
    ['profiles.find.word', 0, 1, false],
    ['profiles.find.reverse', 0, 1, false],
    ['profiles.find.regex', 0, 1, false],
    ['profiles.find.selection', 0, 1, false],
    ['profiles.find.show', 0, 1, false],
    ['profiles.find.value', 0, 1, false],
    ['skipMore', 0, 1, false],
    ['skipMoreDelay', 0, SettingType.Number, 5000],
    ['commandMinLines', 0, SettingType.Number, 1],
    ['backupReplaceCharacters', 0, SettingType.Boolean, true],
    ['simpleAlarms', 0, SettingType.Boolean, false],
    ['simpleEditor', 0, SettingType.Boolean, false],
    ['selectLastCommand', 0, SettingType.Boolean, true],
    ['statusMode', 0, SettingType.Number, isMobile() ? 1 : 0],
    ['logger.split', 0, SettingType.Number, 204],
    ['showChatWindow', 0, SettingType.Number, 0],
    ['chat.enableColors', 0, SettingType.Number, true],
    ['chat.enableBackgroundColors', 0, SettingType.Number, true],
];

export const SettingProperties = ['bufferSize', 'commandDelay', 'commandDelayCount', 'commandHistorySize', 'fontSize', 'cmdfontSize', 'commandEcho', 'flashing', 'autoConnect', 'enableAliases', 'enableTriggers', 'enableMacros', 'showScriptErrors', 'commandStacking', 'commandStackingChar', 'htmlLog', 'keepLastCommand', 'enableMCCP', 'enableUTF8', 'font', 'cmdfont', 'mapper.follow', 'mapper.enabled', 'mapper.split', 'mapper.fill', 'showMapper', 'fullScreen', 'enableMXP', 'enableMSP', 'parseCommands', 'lagMeter', 'enablePing', 'enableEcho', 'enableSpeedpaths', 'speedpathsChar', 'parseSpeedpaths', 'profile', 'parseSingleQuotes', 'parseDoubleQuotes', 'logEnabled', 'logPrepend', 'logOffline', 'logUniqueOnConnect', 'enableURLDetection', 'notifyMSPPlay', 'CommandonClick', 'allowEval', 'allowEscape', 'AutoCopySelectedToClipboard', 'enableDebug', 'editorPersistent', 'askonclose', 'dev', 'chat.captureLines', 'chat.captureAllLines', 'chat.captureReviews', 'chat.captureTells', 'chat.captureTalk', 'chat.gag', 'chat.CaptureOnlyOpen', 'checkForUpdates', 'autoCreateCharacter', 'askonchildren', 'mapper.legend', 'mapper.room', 'mapper.importType', 'mapper.vscroll', 'mapper.hscroll', 'mapper.scale', 'mapper.alwaysOnTop', 'mapper.alwaysOnTopClient', 'mapper.memory', 'mapper.memorySavePeriod', 'mapper.active.ID', 'mapper.active.x', 'mapper.active.y', 'mapper.active.z', 'mapper.active.area', 'mapper.active.zone', 'mapper.persistent', 'profiles.split', 'profiles.askoncancel', 'profiles.triggersAdvanced', 'profiles.aliasesAdvanced', 'profiles.buttonsAdvanced', 'profiles.macrosAdvanced', 'profiles.contextsAdvanced', 'profiles.codeEditor', 'profiles.watchFiles', 'chat.alwaysOnTop', 'chat.alwaysOnTopClient', 'chat.log', 'chat.persistent', 'chat.zoom', 'chat.font', 'chat.fontSize', 'title', 'logGagged', 'logTimeFormat', 'autoConnectDelay', 'autoLogin', 'onDisconnect', 'enableKeepAlive', 'keepAliveDelay', 'newlineShortcut', 'logWhat', 'logErrors', 'showErrorsExtended', 'reportCrashes', 'enableCommands', 'commandChar', 'escapeChar', 'enableVerbatim', 'verbatimChar', 'soundPath', 'logPath', 'theme', 'gamepads', 'buttons.connect', 'buttons.characters', 'buttons.preferences', 'buttons.log', 'buttons.clear', 'buttons.lock', 'buttons.map', 'buttons.user', 'buttons.mail', 'buttons.compose', 'buttons.immortal', 'buttons.codeEditor', 'find.case', 'find.word', 'find.reverse', 'find.regex', 'find.selection', 'find.show', 'display.split', 'display.splitHeight', 'display.splitLive', 'display.roundedOverlays', 'backupLoad', 'backupSave', 'backupAllProfiles', 'backupReplaceCharacters', 'scrollLocked', 'showStatus', 'showCharacterManager', 'showChat', 'showEditor', 'showArmor', 'showStatusWeather', 'showStatusLimbs', 'showStatusHealth', 'showStatusExperience', 'showStatusPartyHealth', 'showStatusCombatHealth', 'showButtonBar', 'allowNegativeNumberNeeded', 'spellchecking', 'hideOnMinimize', 'showTrayIcon', 'statusExperienceNeededProgressbar', 'trayClick', 'trayDblClick', 'pasteSpecialPrefix', 'pasteSpecialPostfix', 'pasteSpecialReplace', 'pasteSpecialPrefixEnabled', 'pasteSpecialPostfixEnabled', 'pasteSpecialReplaceEnabled', 'display.showSplitButton', 'chat.split', 'chat.splitHeight', 'chat.splitLive', 'chat.roundedOverlays', 'chat.showSplitButton', 'chat.bufferSize', 'chat.flashing', 'display.hideTrailingEmptyLine', 'display.enableColors', 'display.enableBackgroundColors', 'enableSound', 'allowHalfOpen', 'editorClearOnSend', 'editorCloseOnSend', 'askOnCloseAll', 'askonloadCharacter', 'mapper.roomWidth', 'mapper.roomGroups', 'mapper.showInTaskBar', 'profiles.enabled', 'profiles.sortOrder', 'profiles.sortDirection', 'profiles.showInTaskBar', 'profiles.profileSelected', 'profiles.profileExpandSelected', 'chat.lines', 'chat.showInTaskBar', 'chat.showTimestamp', 'chat.timestampFormat', 'chat.tabWidth', 'chat.displayControlCodes', 'chat.emulateTerminal', 'chat.emulateControlCodes', 'chat.wordWrap', 'chat.wrapAt', 'chat.indent', 'chat.scrollLocked', 'chat.find.case', 'chat.find.word', 'chat.find.reverse', 'chat.find.regex', 'chat.find.selection', 'chat.find.show', 'chat.find.highlight', 'chat.find.location', 'codeEditor.showInTaskBar', 'codeEditor.persistent', 'codeEditor.alwaysOnTop', 'codeEditor.alwaysOnTopClient', 'autoTakeoverLogin', 'fixHiddenWindows', 'maxReconnectDelay', 'enableBackgroundThrottling', 'enableBackgroundThrottlingClients', 'showInTaskBar', 'showLagInTitle', 'mspMaxRetriesOnError', 'logTimestamp', 'logTimestampFormat', 'disableTriggerOnError', 'prependTriggeredLine', 'enableParameters', 'parametersChar', 'enableNParameters', 'nParametersChar', 'enableParsing', 'externalWho', 'externalHelp', 'watchForProfilesChanges', 'onProfileChange', 'onProfileDeleted', 'enableDoubleParameterEscaping', 'ignoreEvalUndefined', 'enableInlineComments', 'enableBlockComments', 'inlineCommentString', 'blockCommentString', 'allowCommentsFromCommand', 'saveTriggerStateChanges', 'groupProfileSaves', 'groupProfileSaveDelay', 'returnNewlineOnEmptyValue', 'pathDelay', 'pathDelayCount', 'echoSpeedpaths', 'alwaysShowTabs', 'scriptEngineType', 'initializeScriptEngineOnLoad', 'find.highlight', 'find.location', 'display.showInvalidMXPTags', 'display.showTimestamp', 'display.timestampFormat', 'display.displayControlCodes', 'display.emulateTerminal', 'display.emulateControlCodes', 'display.wordWrap', 'display.tabWidth', 'display.wrapAt', 'display.indent', 'statusWidth', 'showEditorInTaskBar', 'trayMenu', 'lockLayout', 'loadLayout', 'useSingleInstance', 'statusWidth', 'characterManagerDblClick', 'warnAdvancedSettings', 'showAdvancedSettings', 'enableTabCompletion', 'tabCompletionBufferLimit', 'ignoreCaseTabCompletion', 'enableNotifications', 'commandAutoSize', 'commandWordWrap', 'commandScrollbars', 'tabCompletionList', 'tabCompletionLookupType', 'tabCompletionReplaceCasing', 'characterManagerAddButtonAction', 'enableCrashReporting', 'characterManagerPanelWidth', 'ignoreInputLeadingWhitespace', 'profiles.find.case', 'profiles.find.word', 'profiles.find.reverse', 'profiles.find.regex', 'profiles.find.selection', 'profiles.find.show', 'profiles.find.value', 'skipMore', 'skipMoreDelay', 'commandMinLines', 'simpleAlarms', 'simpleEditor', 'selectLastCommand', 'statusMode', 'logger.split', 'showChatWindow', 'chat.enableColors', 'chat.enableBackgroundColors'];

/**
 * Class that contains all options, sets default values and allows loading and saving to json files
 *
 * @export
 * @class Settings
 */
export class Settings {
    public colors: string[];
    public enableTriggers: boolean;
    public showErrorsExtended: boolean;
    public logErrors: boolean;
    public commandEcho: boolean;
    public autoConnect: boolean;
    public keepLastCommand: boolean;

    constructor() {
        /*
        let subs;
        let obj;
        let k;
        let kl;
        */
        for (let s = 0, sl = SettingList.length; s < sl; s++) {
            if (SettingList[s][2] === SettingType.Custom) continue;
            this[SettingList[s][0]] = Settings.getValue(SettingList[s][0]);
            if (SettingList[s][1] && SettingList[s][1].length)
                this[SettingList[s][1]] = Settings.getValue(SettingList[s][1]);
            /*
            subs = SettingList[s][0].split('.');
            if ((kl = subs.length) > 1) {
                obj = this[subs[0]] = {};
                for (k = 1; k < kl - 1; k++) {
                    obj[subs[k]] = {};
                }
                obj[subs[subs.length-1]] = Settings.getValue(SettingList[s][0]);
            }
            */
        }
        this.colors = Settings.getValue('colors');
    }

    public static settingError = false;

    public static getValue(setting: string, defaultValue?: any) {
        let tmp;
        if (Settings.settingError) {
            if (defaultValue === null || typeof defaultValue == 'undefined')
                return Settings.defaultValue(setting);
            return defaultValue;
        }
        try {
            tmp = $.jStorage.get(setting);
            if (typeof tmp == 'undefined' || tmp === null) {
                if (defaultValue === null || typeof defaultValue == 'undefined')
                    return Settings.defaultValue(setting);
                return defaultValue;
            }
            switch (setting) {
                case 'showChat':
                case 'showStatus':
                case 'showButtons':
                case 'enableCommands':
                case 'enableVerbatim':
                case 'allowEscape':
                case 'autoConnect':
                case 'mapFollow':
                case 'mapEnabled':
                case 'flashing':
                case 'commandEcho':
                case 'enableAliases':
                case 'enableTriggers':
                case 'enableButtons':
                case 'enableMacros':
                case 'commandStacking':
                case 'htmlLog':
                case 'keepLastCommand':
                case 'fullScreen':
                case 'enableMXP':
                case 'enableURLDetection':
                case 'enableMCCP':
                case 'enableUTF8':
                case 'parseCommands':
                case 'lagMeter':
                case 'showScriptErrors':
                case 'enablePing':
                case 'enableEcho':
                case 'enableSpeedpaths':
                case 'parseSpeedpaths':
                case 'mapper.enabled':
                case 'MapperSplitArea':
                case 'mapper.split':
                case 'MapperFillWalls':
                case 'mapper.fill':
                case 'mapper.follow':
                case 'MapperOpen':
                case 'showMapper':
                case 'parseSingleQuotes':
                case 'parseDoubleQuotes':
                case 'logEnabled':
                case 'logOffline':
                case 'logPrepend':
                case 'logUniqueOnConnect':
                case 'toolsPinned':
                case 'notifyMSPPlay':
                case 'CommandonClick':
                case 'allowEval':
                case 'disableTriggerOnError':
                case 'prependTriggeredLine':
                case 'chat.captureLines':
                case 'chat.captureAllLines':
                case 'chat.captureReviews':
                case 'chat.captureTells':
                case 'chat.captureTalk':
                case 'chat.gag':
                case 'chat.CaptureOnlyOpen':
                case 'simpleAlarms':
                case 'simpleEditor':
                case 'selectLastCommand':
                case 'showLagInTitle':
                    if (tmp == 1)
                        return true;
                    return false;
                case 'colors':
                case 'chat.lines':
                    if (tmp === null || typeof tmp == 'undefined' || tmp.length === 0)
                        return [];
                    return JSON.parse(tmp);
            }
            return tmp;
        }
        catch (err) {
            if (!Settings.settingError) {
                alert('Unable to save to localStorage so reverting to default,\n\nError description: ' + err.message);
                Settings.settingError = true;
            }
            if (defaultValue === null || typeof defaultValue == 'undefined')
                return Settings.defaultValue(defaultValue);
            return defaultValue;
        }
    }

    public static setValue(setting: string, value) {
        switch (setting) {
            case 'colors':
            case 'chat.lines':
                if (value === null || typeof value == 'undefined' || value.length === 0)
                    $.jStorage.deleteKey(setting);
                else
                    $.jStorage.set(setting, JSON.stringify(value));
                break;
            default:
                if (typeof value == 'boolean') {
                    if (value)
                        $.jStorage.set(setting, 1);
                    else
                        $.jStorage.set(setting, 0);
                }
                else
                    $.jStorage.set(setting, value);
                break;
        }
    }

    public static clearValue(setting: string) {
        $.jStorage.deleteKey(setting);
    }

    public static defaultValue(setting) {
        switch (setting) {
            case 'bufferSize': return 500;
            case 'commandDelay': return 500;
            case 'commandDelayCount': return 5;
            case 'commandHistorySize': return 20;
            case 'fontSize': return '1em';
            case 'cmdfontSize': return '1em';
            case 'commandEcho': return true;
            case 'flashing': return false;
            case 'autoConnect': return true;
            case 'enableAliases': return true;
            case 'enableTriggers': return true;
            case 'enableMacros': return true;
            case 'showScriptErrors': return false;
            case 'commandStacking': return true;
            case 'commandStackingChar': return ';';
            case 'htmlLog': return true;
            case 'keepLastCommand': return true;
            case 'enableMCCP': return true;
            case 'enableUTF8': return true;
            case 'font': return '\'Courier New\', Courier, monospace';
            case 'cmdfont': return '\'Courier New\', Courier, monospace';
            case 'mapFollow':
            case 'mapper.follow': return true;
            case 'mapEnabled':
            case 'mapper.enabled': return true;
            case 'MapperSplitArea':
            case 'mapper.split': return false;
            case 'MapperFillWalls':
            case 'mapper.fill': return false;
            case 'MapperOpen':
            case 'showMapper': return false;
            case 'fullScreen': return false;
            case 'enableMXP': return true;
            case 'enableMSP': return true;
            case 'parseCommands': return true;
            case 'lagMeter': return true;
            case 'enablePing': return false;
            case 'enableEcho': return true;
            case 'enableSpeedpaths': return true;
            case 'speedpathsChar': return '!';
            case 'parseSpeedpaths': return true;
            case 'profile': return 'Default';
            case 'parseSingleQuotes': return false;
            case 'parseDoubleQuotes': return true;
            case 'logEnabled': return false;
            case 'logPrepend': return false;
            case 'logOffline': return false;
            case 'logUniqueOnConnect': return true;
            case 'enableURLDetection': return true;
            case 'notifyMSPPlay': return false;
            case 'CommandonClick': return true;
            case 'allowEval': return true;
            case 'allowEscape': return true;
            case 'AutoCopySelectedToClipboard': return false;
            case 'enableDebug': return false;
            case 'editorPersistent': return false;
            case 'askonclose': return true;
            case 'dev': return false;
            //New settings
            case 'chat.captureLines': return false;
            case 'chat.captureAllLines': return false;
            case 'chat.captureReviews': return false;
            case 'chat.captureTells': return false;
            case 'chat.captureTalk': return false;
            case 'chat.gag': return false;
            case 'chat.CaptureOnlyOpen': return false;
            case 'checkForUpdates': return false;
            case 'autoCreateCharacter': return false;
            case 'askonchildren': return true;
            case 'mapper.legend': return false;
            case 'mapper.room': return false;
            case 'mapper.importType': return 1;
            case 'mapper.vscroll': return 0;
            case 'mapper.hscroll': return 0;
            case 'mapper.scale': return 100;
            case 'mapper.active': return {
                ID: null,
                x: 0,
                y: 0,
                z: 0,
                area: null,
                zone: 0
            };
            case 'mapper.active.ID': return null;
            case 'mapper.active.x': return 0;
            case 'mapper.active.y': return 0;
            case 'mapper.active.z': return 0;
            case 'mapper.active.area': return null;
            case 'mapper.active.zone': return 0;
            case 'profiles.split': return 204;
            case 'logger.split': return 204;
            case 'profiles.askoncancel': return true;
            case 'profiles.triggersAdvanced': return false;
            case 'profiles.aliasesAdvanced': return false;
            case 'profiles.buttonsAdvanced': return false;
            case 'profiles.macrosAdvanced': return false;
            case 'profiles.contextsAdvanced': return false;
            case 'profiles.codeEditor': return true;
            case 'chat.log': return false;
            case 'chat.zoom': return 1;
            case 'chat.font': return '\'Courier New\', Courier, monospace';
            case 'chat.fontSize': return '1em';
            case 'title': return '$t';
            case 'logGagged': return false;
            case 'logTimeFormat': return 'YYYYMMDD-HHmmss';
            case 'autoConnectDelay': return 600;
            case 'autoLogin': return true;
            case 'onDisconnect': return OnDisconnect.ReconnectDialog;
            case 'enableKeepAlive': return false;
            case 'keepAliveDelay': return 0;
            case 'newlineShortcut': return NewLineType.Ctrl;
            case 'logWhat': return 1;
            case 'logErrors': return true;
            case 'showErrorsExtended': return false;
            case 'reportCrashes': return false;
            case 'enableCommands': return true;
            case 'commandChar': return '#';
            case 'escapeChar': return '\\';
            case 'enableVerbatim': return true;
            case 'verbatimChar': return '`';
            case 'soundPath': return '';
            case 'logPath': return '';
            case 'theme': return '';
            case 'gamepads': return false;
            case 'backupLoad': return 30;
            case 'backupSave': return 30;
            case 'backupAllProfiles': return true;
            case 'backupReplaceCharacters': return true;
            case 'scrollLocked': return false;
            case 'showStatus': return !isMobile();
            case 'showChat': return false;
            case 'showEditor': return false;
            case 'showArmor': return false;
            case 'showStatusWeather': return true;
            case 'showStatusLimbs': return true;
            case 'showStatusHealth': return true;
            case 'showStatusExperience': return true;
            case 'showStatusPartyHealth': return true;
            case 'showStatusCombatHealth': return true;
            case 'allowNegativeNumberNeeded': return false;
            case 'spellchecking': return true;
            case 'statusExperienceNeededProgressbar': return false;
            case 'pasteSpecialPrefix': return '';
            case 'pasteSpecialPostfix': return '';
            case 'pasteSpecialReplace': return '';
            case 'pasteSpecialPrefixEnabled': return true;
            case 'pasteSpecialPostfixEnabled': return true;
            case 'pasteSpecialReplaceEnabled': return true;
            case 'display.showSplitButton': return true;
            case 'chat.bufferSize': return 500;
            case 'chat.flashing': return false;
            case 'display.hideTrailingEmptyLine': return true;
            case 'display.enableColors': return true;
            case 'display.enableBackgroundColors': return true;
            case 'enableSound': return true;
            case 'editorClearOnSend': return true;
            case 'editorCloseOnSend': return true;
            case 'askOnCloseAll': return true;
            case 'askonloadCharacter': return true;
            case 'mapper.roomWidth': return 200;
            case 'mapper.roomGroups': return 1 | 2 | 4;
            case 'mapper.showInTaskBar': return false;
            case 'profiles.enabled': return [];
            case 'profiles.sortOrder': return ProfileSortOrder.Priority | ProfileSortOrder.Index;
            case 'profiles.sortDirection': return 1;
            case 'profiles.profileSelected': return 'default';
            case 'profiles.profileExpandSelected': return true;
            case 'chat.lines': return [];
            case 'chat.showTimestamp': return 0;
            case 'chat.timestampFormat': return '[[]MM-DD HH:mm:ss.SSS[]] ';
            case 'chat.tabWidth': return 8;
            case 'chat.displayControlCodes': return false;
            case 'chat.emulateTerminal': return false;
            case 'chat.emulateControlCodes': return true;
            case 'chat.wordWrap': return false;
            case 'chat.wrapAt': return 0;
            case 'chat.indent': return 4;
            case 'chat.enableColors': return true;
            case 'chat.enableBackgroundColors': return true;
            case 'autoTakeoverLogin': return false;
            case 'maxReconnectDelay': return 3600;
            case 'showLagInTitle': return false;
            case 'mspMaxRetriesOnError': return 0;
            case 'logTimestamp': return 0;
            case 'logTimestampFormat': return '[[]MM-DD HH:mm:ss.SSS[]] ';
            case 'disableTriggerOnError': return true;
            case 'prependTriggeredLine': return true;
            case 'enableParameters': return true;
            case 'parametersChar': return '%';
            case 'enableNParameters': return true;
            case 'nParametersChar': return '$';
            case 'enableParsing': return true;
            case 'onProfileChange': return OnProfileChange.Nothing;
            case 'onProfileDeleted': return OnProfileDeleted.Nothing;
            case 'enableDoubleParameterEscaping': return false;
            case 'ignoreEvalUndefined': return true;
            case 'enableInlineComments': return true;
            case 'enableBlockComments': return true;
            case 'inlineCommentString': return '//';
            case 'blockCommentString': return '/*';
            case 'allowCommentsFromCommand': return false;
            case 'saveTriggerStateChanges': return true;
            case 'groupProfileSaves': return false;
            case 'groupProfileSaveDelay': return 20000;
            case 'returnNewlineOnEmptyValue': return false;
            case 'pathDelay': return 0;
            case 'pathDelayCount': return 1;
            case 'echoSpeedpaths': return false;
            case 'scriptEngineType': return ScriptEngineType.Simple;
            case 'initializeScriptEngineOnLoad': return false;
            case 'display.showInvalidMXPTags': return false;
            case 'display.showTimestamp': return 0;
            case 'display.timestampFormat': return '[[]MM-DD HH:mm:ss.SSS[]] ';
            case 'display.displayControlCodes': return false;
            case 'display.emulateTerminal': return false;
            case 'display.emulateControlCodes': return true;
            case 'display.wordWrap': return false;
            case 'display.tabWidth': return 8;
            case 'display.wrapAt': return 0;
            case 'display.indent': return 4;
            case 'statusWidth': return -1;
            case 'extensions': return {};
            case 'warnAdvancedSettings': return true;
            case 'showAdvancedSettings': return false;
            case 'enableTabCompletion': return true;
            case 'ignoreCaseTabCompletion': return false;
            case 'tabCompletionBufferLimit': return 100;
            case 'enableNotifications': return true;
            case 'echo': return Echo.None;
            case 'commandAutoSize': return false;
            case 'commandWordWrap': return false;
            case 'commandMinLines': return 1;
            case 'tabCompletionLookupType': return TabCompletion.PrependBuffer;
            case 'tabCompletionList': return '';
            case 'tabCompletionReplaceCasing': return 0;
            case 'ignoreInputLeadingWhitespace': return false;
            case 'skipMore': return false;
            case 'skipMoreDelay': return 5000;
            case 'simpleAlarms': return false;
            case 'simpleEditor': return false;
            case 'selectLastCommand': return true;
            case 'statusMode': isMobile() ? 1 : 0;
            case 'showChatWindow': return 0;
        }
        return null;
    }

    public static exist(setting) {
        let tmp = $.jStorage.get(setting);
        return typeof tmp !== 'undefined' && tmp !== null;
    }

    public save() {
        for (let prop in this) {
            if (!this.hasOwnProperty(prop)) continue;
            Settings.setValue(prop, this[prop]);
        }
    }

    public reset() {
        for (let s = 0, sl = SettingList.length; s < sl; s++) {
            if (SettingList[s][2] === SettingType.Custom) continue;
            this[SettingList[s][0]] = Settings.defaultValue(SettingList[s][0]);
        }
        this.colors = [];
    }
}