- Add on disconnect option and dialog
- New options
    - enableParsing - quick enabled triggered by interface?
    - enableTriggers - quick enabled triggered by interface?
- A general shadowmud plugin that groups all sm related
    - immortal basic tools for shadowmud            
        - client.telnet.GMCPSupports.push('IED 1');
        - Add #win support if added
        - The old web client had a simple upload for uploading a file to current working directory, seems ot have broken at some point
    - Add mail composer like jiMUD using advanced editor dialog as a base as exact same code but adds to/cc/subject fields and instead of sending directly it executes a set of commands to open mail and send contents
- Profile manager:
    - Add undo system
    - Add options for profile sort order and direction
    - Add option which profile to select on load
    - Add option to expand selected profile on load
    - Add search system
    - Add advanced value editor using ace or maybe monaco editor, granted this is more complex with how the interface is designed, would require recreating the editor every time one of the pages loaded and could be slow, may be best to try code mirror as it is newer and more modern and easier to use then monaco i think
```
## Profile manager

- `Enable profile manager code editor` disable or enable the code editor for the profile manager
- `Enable profile manager file watcher` disable or enable watching for profile file changes to warn when saving overrides
- `Profile manager sort order` determine how items are sorted in the profile manager display tree, priority is first, then alpha, finally index, you cna have one or all three options enabled **note** Changing this setting while profile manager is open will not resort the displayed items
  - `Alpha` sort by alpha numeric
  - `Index` sort by index
  - `Priority` sort by item priority
- `Profile manager sort direction` select to display items in ascending or descending order  **note** Changing this setting while profile manager is open will not resort the displayed items
- `Profile to select on load` select which profile to pick when profile manager is first opened, falls back to Default if profile not found
- `Expand selected profile on load` auto expand selected profile when profile manager is first opened
```
- recode advanced editor to not use jquery when possible
- Add paste special? may not be possible as cant control paste
- Mapper
    - Recode map backend into a worker to get/set rooms etc... granted localforage does not work in workers so adds extra layer of complexity
    - Add true mapper window
- run firefox/chrome performance tools to optimize code/loading
- Add advanced setting view for complex editing
- Panel bar
    - Add separate settings to track zoom