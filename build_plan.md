Making a maps wallpaper app in nextjs. For now make this in "/" route itself and no authentication.

# Build plan

## Objective: Target the fundamentals of map, how map works, make a proper logical clean interface (code interafce I don't mean UI) which gives me full fidelity to make UI elements on top later which will then communicate with the map layer smoothly and cleanly, no cello tape bullshit, no slop. This will have physical UI elements, will discuss that later, and ai agent support so I can integrate groq or other ai providers and make an AI agent which users can interract with to modify the style of the map. Follow agents.md . 

## This needs to be very simple, clean code so i can maintain it in future. This will have 3d capabilities in future, to show buildings and other stuff. But for now just focus on perfective a clean 2d top-down view map wallpaper app, which later can be expanded to support 3d.

### All the below info is best to my knowledge and research to make this app. If you have better recomendations then do let me know. If there's a more solid plan then go ahead.

Total future stack:
| Layer        | Tool                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Map renderer | MapLibre GL JS + react-map-gl                                                                                                    |
| Tiles        | OpenFreeMap                                                                                                                      |
| App          | Nextjs client and server (use api routes for server stuff) + firebase (no firebase auth so use admin sdk and strictly in server) |
| Search       | Nominatim (free, rate-limited) or MapTiler geocoding (100K free)                                                                 |
| Payments     | Dodopayments                                                                                                                     |
| Auth         | Clerk                                                                                                                            |
| Style state  | Zustand                                                                                                                          |



layers of map:
| Layer                 | What It Is                                |
| --------------------- | ----------------------------------------- |
| `water`               | Oceans, lakes, rivers                     |
| `waterway`            | Thin rivers, streams, canals              |
| `landcover`           | Forests, grass, ice                       |
| `landuse`             | Residential, commercial, industrial zones |
| `park`                | Parks, gardens, playgrounds               |
| `boundary`            | Country, state, city borders              |
| `building`            | Building footprints                       |
| `transportation`      | All roads, paths, railways                |
| `transportation_name` | Road labels                               |
| `place`               | City names, neighborhoods                 |
| `poi`                 | Restaurants, shops, landmarks             |



each layer has:
| Layer Type                  | Properties You Control                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `background`                | `background-color`, `background-opacity`                                                    |
| `fill` (water, land, parks) | `fill-color`, `fill-opacity`, `fill-outline-color`, `fill-pattern`                          |
| `line` (roads, borders)     | `line-color`, `line-width`, `line-opacity`, `line-dasharray`, `line-gap-width`, `line-blur` |
| `symbol` (labels, icons)    | `text-color`, `text-halo-color`, `text-halo-width`, `text-opacity`, `icon-color`            |
fill-pattern lets you use sprites (small repeating images) instead of solid colors.
Water can be wavy lines instead of blue, Parks can be dot patterns instead of green, buildings bricks texture.



lines anatomy for roads:
| Property         | What It Does                            | Fun Use                                               |
| ---------------- | --------------------------------------- | ----------------------------------------------------- |
| `line-width`     | Thickness in pixels                     | Make motorways 10px thick, look like transit diagrams |
| `line-dasharray` | Pattern of dashes/gaps                  | Dotted paths look like treasure maps                  |
| `line-gap-width` | Space between double lines              | Creates highway median effect                         |
| `line-blur`      | Gaussian blur                           | Neon glow effect on roads                             |
| `line-offset`    | Shift line from center                  | One-way street visualization                          |
| `line-cap`       | End shape: `butt`, `round`, `square`    | Round caps feel hand-drawn                            |
| `line-join`      | Corner shape: `bevel`, `round`, `miter` | Round joins feel organic                              |



Filters are WHERE clauses for map data. They decide which features in a layer get styled.
Examples:
["==", ["get", "class"], "motorway"] → only motorways
["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]] → only major roads
["has", "name"] → only features with names
[">=", ["get", "area"], 10000] → only large parks


 Transitions (Smooth Morphing)
MapLibre supports transitions between property changes:
plain
"transition": {
  "duration": 300,
  "delay": 0
}



