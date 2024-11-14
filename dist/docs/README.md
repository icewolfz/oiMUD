# oiMUD

A mud wen client that can connect to muds that expose a websocket port

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
