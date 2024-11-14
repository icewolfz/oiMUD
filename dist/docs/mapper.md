# Mapper

## Room markers

- `Red dot` The red dot is the current room where the player should be or where any paths will start from
- `Yellow dot` A marker on a highlighted path
- `Blue dot` The destination room for a highlighted path
- `Green dot` The start room for highlighted path if current room has been changed
- `Rounded transparent rectangle` A room that is inside a transparent rounded rectangle is the currently selected room

## Keyboard shortcuts

- `Arrow keys` scroll the map north, south, east, or west
- `Numpad 1` scroll the map southwest
- `Numpad 2` scroll the map south
- `Numpad 3` scroll the map southeast
- `Numpad 4` scroll the map west
- `Numpad 5` scroll the map focus on current room
- `Numpad 6` scroll the map east
- `Numpad 7` scroll the map northwest
- `Numpad 8` scroll the map north
- `Numpad 9` scroll the map northeast
- `/` go down one zone
- `*` go up one zone
- `-` go down one level
- `+` go up one level
- `escape` cancel current drag
- `delete` remove current selected room

## Mouse

- `Double click` lock drag scrolling on with out the need to hold mouse button down

## Interface

- `Area navigator` Quick navigation to center map on selected area

### Toolbar

- `Show menu` - Show the mapper menu
- `Focus on current room` will center the map on the current room
- `Level` The current map level
- `Zone` The current map zone
- `Zoom` The map zoom level

### Menu

- `Enabled` whether mapper is enabled or not, it not enabled will not add new rooms as you move
- `Show legend` show the legend in the top right corner of the mapper window
- `Show room properties` show the room properties editor, allows you to edit or adjust rooms and mark down notes
- `Refresh` Refresh the map
- `Split areas` determines how the map will layout display, when enabled it will only draw rooms related to the current area, if disabled will attempt all rooms with the same z coordinate and matching zone
- `Display walls` will attempt to draw walls around areas
- `Remove` Toggle remove submenu
  - `Remove selected room` remove the currently selected room from the map
  - `Remove current room` remove the current room from the map
  - `Remove current area` remove all rooms from the area selected from the area navigator
  - `Remove all` remove all rooms from the map
- `Export/Import data` allows for the exporting or importing of data
  - `Export as image` generate a map based on current settings and export as a png image
  - `Export as scaled image` generate a map based on current settings and export based on zoom level
  - `Export current view as image` generate a map based on current settings clipped to current view box
  - `Export current area` export all rooms from currently selected area to a data file
  - `Export all` export all rooms to data file
  - `Import and merge` import mapper data and merge with existing map
  - `Import and replace` clear all current data and import new
- `Actions` The actions menu
  - `Follow` whether the map follows you as you move around the mud and centers on your current room
  - `Focus on current room` will center the map on the current room
  - `Set selected as current` will set currently selected room as current room
  - `Highlight path` hight light a walkable path from current room to selected room
  - `Clear path` clear highlighted path
  - `Walk path` walk the path from current room to selected room
  - `Walk highlighted path` walk the path that has been highlighted
  - `Copy path` Copy path from current room to selected, **Note** may fail depending on clipboard support
  - `Copy path as stacked`  Same as copy path but formatted using command stack
  - `Copy path as speedpath` Same as copy path but formatted as a speedpath
  - `Copy highlighted path` Copy highlighted path, **Note** may fail depending on clipboard support
  - `Copy highlighted as stacked`  Same as copy highlighted path but formatted using command stack
  - `Copy highlighted as speedpath` Same as copy highlighted path but formatted as a speedpath
- `About` About the map, displays total areas, total rooms, and highest zone

## Navigation

The map allows you to navigate by using the cordial arrows provided to scroll around, you may click and hold to preform rapid scrolling. Aside from scrolling you can drag the map view around using mouse or supported touch devices.

## Map

- `Areas` areas are unique locations that group rooms together
- `Level` levels are Z-Plane coordinates based on a X,Y,Z generated system
- `Zones` zones are sub areas that exist in an area by an unknown or unique travel path, or when transition you from one scale to another.

## Room Properties

### General

- `Name` The room short name, displayed at the top of the room properties
- `Background` a custom background color, supports standard hex, rgb, and rgba css formatting and color words, for example: #FF0000, rgb(255,0,0), rgba(255,0,0,255), red are all the same color and valid formats

### Location

The x, y, z, zone are generated when a room is first added to the map based on the room that was linked.

- `Area` The area the room is part of
- `X` The room's x coordinate
- `Y` The room's y coordinate
- `Z` The room's z coordinate
- `Zone` The room's zone, generated based on how entered

### Details

Details are settings for a room that describe what the room has or what the npc offers as services

- `Indoors` is the room indoors or outdoors
- `Terrain` the rooms terrain type

#### Details

- `Dock` The room can dock ships
- `Pier` The room can be fished from
- `Bank` The room is a bank
- `WaterSource` The room has a water source to drink, wash, or fill bottles from

#### NPC

- `None` The room has no NPC's that offer services
- `Shop` The room contains an NPC that sells or buys items
- `Hospital` The room contains a cleric that offers healing services
- `Bar` The room has an NPC that sells drinks
- `Restaurant` The room has an NPC that sells food
- `Trainer` The room has an NPC trainer

### Notes

Custom notes you may want to add about the selected room

## Known Issues

- `Blurred or spacing between rooms` this is mostly caused by different zoom levels due to how the mapper handles anti alias rooms map blur or shift just a minor 0.5 pixel to throw it off just a tad, it mostly happens in zoom levels that are not 25% intervals
- `Laggy map` when speed walking or moving quickly the map may lag or slow
- `Jumpy rooms or rooms in weird locations/only room displayed` This is mostly caused by the mapper losing track of internal coordinates or a non-standard exit, this is caused by multiple start locations when using multiple characters.
  - `The most common causes`
    - `Multiple characters` Each new start location is started as internal coordinates of 0,0,0 as it is a new "room" and does not know how it links to original map.
    - `Teleportation` When teleported to new locations may cause mapping coordinates to be thrown off.
    - `Portals` Magical or other portals that link two areas together as it will attempt to build coordinates off source room and since no standard it will generate a new zone and set the rooms x,y,z to source rooms coordinates
    - `Removing a room` will cause the coordinates to be lost and unless you go back to an already mapped room it will start over at 0,0,0 and possibly a new zone and will throw off mapper
  - `Possible fixes`:
    - Map as one character as much as you can to try and avoid as much jumping as possible
    - Manually edit each room's x,y,z,zone coordinates align them up to the previous mapped section
    - Move to a known good room then remove the poorly mapped room or rooms and remap beginning from the good room so that the rooms will be generated with proper generated coordinates.
- `Missing rooms` Possible corrupted map data, error with mapper, or browser deleted stored data
- `Mapper not saving` may have run out of storage space, many browsers limit the amount of storage web pages can use
- `Auto walk out of order directions` Auto walk can sometimes get its directions out of order if computer is slow processing, fix by increasing the [Delay between directions](preferences.md#mapper) time until the problem is limited or disappears.
