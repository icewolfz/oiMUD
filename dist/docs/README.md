# oiMUD

A mud web client that can connect to muds that expose a websocket port

## Supported URL parameters

- `host` set a custom host to connect to, overrides set host
- `port` set a custom port to connect to, overrides set port

This will attempt to connect to example.com on port 23: 
  http://URL/index.htm?host=www.example.com&port=23

## FAQ

Basic questions answered about oiMUD

- [oiMUD FAQ](faq.md)

## References

- [Interface](interface.md)
- [Profiles](profiles.md)
- [Speedpaths](speedpaths.md)
- [Commands](commands.md)
- [Functions](functions.md)
- [Preferences](preferences.md)
- [Scripting](scripting.md)
- [Mapper](mapper.md)

## Known Issues

- `Edge` There are possible issues with websockets sending extra data causing data to buffer and corrupt sent commands, simply resend if it happens.
- `IE 11` Not officially supported
- `Chrome` Screen readers may re-read the main display text from the beginning
- `Mapper` Due to browser storage limits mapping data may not correctly save.
  - `Firefox` you can increase your storage limits by changing the 'dom.storage.default_quota' setting open about:config, search for dom.storage.default_quota, and enter a larger #
- `CClearer` If installed or similar apps, it may monitor browsers and clear data on close or on a schedule, either turn off monitoring or check to ignore your browser
- `All browsers` ensure you do not have clear cookies or site data on close enabled or you will lose profiles and map data unless backed up to the mud or locally as text files
- `Text selection` 
  - Firefox
    - Split scroll text selection hs some issues due to issues in firefox and mouse events
    - Custom selection highlight is not visible before version 135 due to not supporting the highlight api
  - All browsers, not matter custom or normal text selection may jump when mouse is moved outside of display control