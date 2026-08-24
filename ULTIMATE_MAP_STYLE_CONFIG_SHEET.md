# ULTIMATE MAP STYLE CONFIG SHEET
## For Coding Agents & UI Element Controls

---

## 1. THE STYLE JSON CONTAINER FORMAT (MapLibre Style Spec v8)

Every style is a single JSON object with these top-level keys:

```json
{
  "version": 8,                    // Always 8. MapLibre validates against this.
  "name": "string",                // Human-readable style name
  "metadata": {},                  // Arbitrary key-value pairs (your app can store anything here)
  "center": [lng, lat],            // Default camera center
  "zoom": number,                  // Default zoom level
  "bearing": number,               // Default rotation (0 = north up)
  "pitch": number,                 // Default tilt (0 = top-down)
  "light": { ... },                // 3D lighting config (for extruded buildings)
  "sources": { ... },              // Where tile data comes from
  "sprite": "url",                 // Icon sprite sheet URL
  "glyphs": "url",                 // Font glyph URL template
  "transition": {                  // Default transition timing for all properties
    "duration": 300,
    "delay": 0
  },
  "layers": [ ... ]               // THE ENTIRE UI. Every visual element is a layer.
}
```

**CRITICAL:** This format is universal. Load it from OpenFreeMap, save it to your database, modify it in your editor, swap it with a Mapbox style — the structure never changes.

---

## 2. AVAILABLE SOURCE-LAYERS (What Data Actually Exists in the Tiles)

These are the 15 data layers inside every OpenFreeMap `.pbf` tile. Your style JSON can reference ANY of these, even if Liberty doesn't use them all.

| source-layer | Geometry | Description | Key Properties |
|---|---|---|---|
| `aerodrome_label` | Point | Airport labels | `name`, `class` (international/public/regional/military/private), `iata`, `icao`, `ele` |
| `aeroway` | Polygon | Runways, taxiways, aprons, helipads | `class` (runway/taxiway/apron/etc), `ref` |
| `boundary` | Line | Country, state, city borders | `admin_level` (2=country, 4=state), `disputed` (0/1), `maritime` (0/1), `claimed_by` |
| `building` | Polygon | Every building footprint | `render_height`, `render_min_height`, `colour`, `hide_3d` |
| `housenumber` | Point | Address numbers on buildings | `housenumber` |
| `landcover` | Polygon | Natural surface | `class` (wood/grass/sand/ice/rock/wetland/farmland), `subclass` (forest/garden/glacier/etc) |
| `landuse` | Polygon | Human land use | `class` (residential/commercial/industrial/school/hospital/stadium/etc) |
| `mountain_peak` | Point | Peaks, volcanoes, saddles, ridges, cliffs | `name`, `class` (peak/volcano/saddle/ridge/cliff/arete), `ele`, `rank` |
| `park` | Polygon | National parks, nature reserves | `class` (national_park/nature_reserve), `name`, `rank` |
| `place` | Point | Continents, countries, states, cities, towns, villages, suburbs, islands | `name`, `class` (continent/country/state/city/town/village/etc), `capital` (2-6), `iso_a2`, `rank` (1-10+) |
| `poi` | Point | Shops, restaurants, hospitals, gas stations, etc. | `name`, `class` (shop/hospital/bar/cafe/school/etc), `subclass` (original OSM tag), `rank` (1-10+) |
| `transportation` | Line | All roads, railways, paths, ferries, aerialways | `class`, `subclass`, `brunnel`, `oneway`, `ramp`, `toll`, `surface`, `network`, `layer` |
| `transportation_name` | Line | Road labels (stitched for placement) | `name`, `ref`, `ref_length`, `network`, `class`, `route_1_network` through `route_6_network` |
| `water` | Polygon | Oceans, lakes, rivers, ponds, docks, swimming pools | `class` (ocean/lake/river/pond/dock/swimming_pool), `intermittent` (0/1), `brunnel` |
| `water_name` | Line | Lake centerlines for labeling | `name`, `class` (lake/bay/strait/sea/ocean) |
| `waterway` | Line | Rivers, streams, canals, drains, ditches | `name`, `class` (stream/river/canal/drain/ditch), `intermittent` (0/1), `brunnel` |

**NOTE:** Liberty style only uses a subset of these (~8-10 layers). You can ADD layers for `housenumber`, `mountain_peak`, `aerodrome_label`, etc. and they will render immediately because the data is already in the tiles.

---

## 3. LAYER TYPES & THEIR FULL PROPERTY INVENTORY

Every layer in the `layers` array has:
- `id`: string (unique name)
- `type`: string (one of the types below)
- `source`: string (references a key in `sources`)
- `source-layer`: string (references a source-layer from Section 2)
- `filter`: expression (optional — which features to include)
- `minzoom`: number (optional — minimum zoom to show this layer)
- `maxzoom`: number (optional — maximum zoom to show this layer)
- `layout`: object (placement rules)
- `paint`: object (visual appearance)

### 3.1 background
**What:** Solid color behind everything. No source or source-layer needed.

| Property | Type | Values | UI Control |
|---|---|---|---|
| `background-color` | color | `#rrggbb`, `rgb()`, `rgba()`, expression | Color picker |
| `background-opacity` | number | 0 to 1 | Slider |
| `background-pattern` | string | Sprite image name | Dropdown (sprite names) |

### 3.2 fill
**What:** Closed polygons (water, landcover, parks, buildings, landuse).

| Property | Type | Values | UI Control |
|---|---|---|---|
| `fill-color` | color | `#rrggbb`, expression | Color picker |
| `fill-opacity` | number | 0 to 1 | Slider |
| `fill-outline-color` | color | `#rrggbb`, expression | Color picker |
| `fill-pattern` | string | Sprite image name | Dropdown |
| `fill-antialias` | boolean | `true` / `false` | Toggle |
| `fill-translate` | array | `[x, y]` in pixels | Offset input |
| `fill-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |

### 3.3 line
**What:** Open paths (roads, borders, rivers, waterways).

| Property | Type | Values | UI Control |
|---|---|---|---|
| `line-color` | color | `#rrggbb`, expression | Color picker |
| `line-opacity` | number | 0 to 1 | Slider |
| `line-width` | number | 0+ pixels, expression, zoom function | Slider / Number input |
| `line-gap-width` | number | 0+ pixels | Slider |
| `line-offset` | number | pixels (positive = right, negative = left) | Slider |
| `line-blur` | number | 0+ pixels | Slider |
| `line-dasharray` | array | `[dash, gap, dash, gap...]` in pixels | Pattern input |
| `line-pattern` | string | Sprite image name | Dropdown |
| `line-cap` | enum | `"butt"`, `"round"`, `"square"` | Dropdown |
| `line-join` | enum | `"bevel"`, `"round"`, `"miter"` | Dropdown |
| `line-miter-limit` | number | 0+ | Number input |
| `line-round-limit` | number | 0+ | Number input |
| `line-translate` | array | `[x, y]` in pixels | Offset input |
| `line-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |

### 3.4 symbol
**What:** Text labels and icons (place names, road names, POIs, water labels).

#### PAINT PROPERTIES:
| Property | Type | Values | UI Control |
|---|---|---|---|
| `text-color` | color | `#rrggbb`, expression | Color picker |
| `text-opacity` | number | 0 to 1 | Slider |
| `text-halo-color` | color | `#rrggbb`, expression | Color picker |
| `text-halo-width` | number | 0+ pixels | Slider |
| `text-halo-blur` | number | 0+ pixels | Slider |
| `icon-color` | color | `#rrggbb`, expression | Color picker |
| `icon-opacity` | number | 0 to 1 | Slider |
| `icon-halo-color` | color | `#rrggbb` | Color picker |
| `icon-halo-width` | number | 0+ pixels | Slider |
| `text-translate` | array | `[x, y]` in pixels | Offset input |
| `text-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |
| `icon-translate` | array | `[x, y]` in pixels | Offset input |
| `icon-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |

#### LAYOUT PROPERTIES:
| Property | Type | Values | UI Control |
|---|---|---|---|
| `visibility` | enum | `"visible"`, `"none"` | Toggle |
| `text-field` | string | `["get", "name"]`, `["get", "ref"]`, static text | Text input / Expression builder |
| `text-font` | array | `["Open Sans Regular"]` | Font dropdown |
| `text-size` | number | 0+ pixels, zoom function | Slider / Number input |
| `text-max-width` | number | 0+ ems | Number input |
| `text-line-height` | number | 0+ ems | Number input |
| `text-letter-spacing` | number | 0+ ems | Slider |
| `text-justify` | enum | `"auto"`, `"left"`, `"center"`, `"right"` | Dropdown |
| `text-anchor` | enum | `"center"`, `"left"`, `"right"`, `"top"`, `"bottom"`, `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"` | Dropdown |
| `text-offset` | array | `[x, y]` in ems | Offset input |
| `text-rotate` | number | degrees | Slider |
| `text-transform` | enum | `"none"`, `"uppercase"`, `"lowercase"` | Dropdown |
| `text-allow-overlap` | boolean | `true` / `false` | Toggle |
| `text-ignore-placement` | boolean | `true` / `false` | Toggle |
| `text-optional` | boolean | `true` / `false` | Toggle |
| `text-padding` | number | 0+ pixels | Slider |
| `icon-image` | string | Sprite name | Dropdown |
| `icon-size` | number | 0+ multiplier | Slider |
| `icon-anchor` | enum | Same as text-anchor | Dropdown |
| `icon-offset` | array | `[x, y]` in pixels | Offset input |
| `icon-rotate` | number | degrees | Slider |
| `icon-allow-overlap` | boolean | `true` / `false` | Toggle |
| `icon-ignore-placement` | boolean | `true` / `false` | Toggle |
| `icon-optional` | boolean | `true` / `false` | Toggle |
| `icon-padding` | number | 0+ pixels | Slider |
| `symbol-placement` | enum | `"point"`, `"line"`, `"line-center"` | Dropdown |
| `symbol-spacing` | number | 0+ pixels | Slider |
| `symbol-avoid-edges` | boolean | `true` / `false` | Toggle |
| `symbol-sort-key` | number | expression | Number input |
| `symbol-z-order` | enum | `"auto"`, `"viewport-y"`, `"source"` | Dropdown |

### 3.5 circle
**What:** Dots (rarely used in base maps, useful for your building claim badges).

| Property | Type | Values | UI Control |
|---|---|---|---|
| `circle-radius` | number | 0+ pixels, expression | Slider |
| `circle-color` | color | `#rrggbb`, expression | Color picker |
| `circle-opacity` | number | 0 to 1 | Slider |
| `circle-stroke-width` | number | 0+ pixels | Slider |
| `circle-stroke-color` | color | `#rrggbb`, expression | Color picker |
| `circle-stroke-opacity` | number | 0 to 1 | Slider |
| `circle-blur` | number | 0+ pixels | Slider |
| `circle-translate` | array | `[x, y]` in pixels | Offset input |
| `circle-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |
| `circle-pitch-scale` | enum | `"map"`, `"viewport"` | Dropdown |
| `circle-pitch-alignment` | enum | `"map"`, `"viewport"` | Dropdown |

### 3.6 fill-extrusion (3D Buildings — for later)
**What:** Extruded 3D polygons.

| Property | Type | Values | UI Control |
|---|---|---|---|
| `fill-extrusion-color` | color | `#rrggbb`, expression | Color picker |
| `fill-extrusion-opacity` | number | 0 to 1 | Slider |
| `fill-extrusion-height` | number | 0+ meters, expression (e.g. `["get", "render_height"]`) | Expression builder |
| `fill-extrusion-base` | number | 0+ meters, expression | Expression builder |
| `fill-extrusion-pattern` | string | Sprite image name | Dropdown |
| `fill-extrusion-translate` | array | `[x, y]` in pixels | Offset input |
| `fill-extrusion-translate-anchor` | enum | `"viewport"`, `"map"` | Dropdown |
| `fill-extrusion-vertical-gradient` | boolean | `true` / `false` | Toggle |

---

## 4. THE EXPRESSION LANGUAGE (Data-Driven Styling)

Expressions are arrays that compute values per-feature on the GPU. They read properties from the vector tile data.

### 4.1 Property Access
| Expression | Meaning |
|---|---|
| `["get", "name"]` | Read the `name` property of the feature |
| `["get", "class", ["get", "properties"]]` | Read nested property |
| `["has", "name"]` | Returns `true` if feature has `name` property |
| `["id"]` | Returns the feature ID |

### 4.2 Lookup / Match
| Expression | Meaning |
|---|---|
| `["==", ["get", "class"], "motorway"]` | True if `class` equals `"motorway"` |
| `["!=", ["get", "class"], "path"]` | True if `class` is not `"path"` |
| `["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]]` | True if `class` is in the list |
| `["match", ["get", "class"], "motorway", "#ff0000", "primary", "#ffaa00", "#cccccc"]` | Returns color based on `class`. Default is last value. |
| `["case", [">", ["get", "render_height"], 50], "#ff0000", "#cccccc"]` | If height > 50, red. Else grey. |

### 4.3 Math
| Expression | Meaning |
|---|---|
| `["+", 1, 2]` | 3 |
| `["-", 5, 2]` | 3 |
| `["*", ["get", "render_height"], 2]` | Double the building height |
| `["/", ["get", "render_height"], 3]` | One-third height |
| `["min", 10, ["get", "render_height"]]` | Minimum of 10 and height |
| `["max", 0, ["get", "render_height"]]` | Maximum of 0 and height |
| `["abs", -5]` | 5 |
| `["floor", 4.7]` | 4 |
| `["ceil", 4.2]` | 5 |
| `["round", 4.5]` | 5 |
| `["pow", 2, 3]` | 8 |
| `["sqrt", 16]` | 4 |

### 4.4 String
| Expression | Meaning |
|---|---|
| `["concat", "Hello", " ", "World"]` | `"Hello World"` |
| `["downcase", "Hello"]` | `"hello"` |
| `["upcase", "hello"]` | `"HELLO"` |

### 4.5 Zoom
| Expression | Meaning |
|---|---|
| `["zoom"]` | Returns current zoom level (number) |
| `["step", ["zoom"], 1, 10, 2, 15, 4]` | Returns 1 below zoom 10, 2 between 10-15, 4 above 15 |
| `["interpolate", ["linear"], ["zoom"], 4, 0.5, 20, 30]` | Linear interpolation between stops |
| `["interpolate", ["exponential", 1.4], ["zoom"], 4, 0.5, 20, 30]` | Exponential interpolation |

### 4.6 Color
| Expression | Meaning |
|---|---|
| `["to-color", "#ff0000"]` | Converts string to color |
| `["to-rgba", "#ff0000"]` | Returns `[255, 0, 0, 1]` |
| `["rgb", 255, 0, 0]` | Creates `#ff0000` |
| `["rgba", 255, 0, 0, 0.5]` | Creates semi-transparent red |
| `["hsl", 0, 100, 50]` | Pure red from HSL |
| `["hsla", 0, 100, 50, 0.5]` | Semi-transparent red from HSLA |

---

## 5. FILTER OPERATORS (Feature Selection)

Filters go in the `filter` property of a layer. Only matching features are rendered.

### 5.1 Comparison
| Operator | Syntax | Example |
|---|---|---|
| `==` | `["==", ["get", "class"], "motorway"]` | class equals motorway |
| `!=` | `["!=", ["get", "class"], "path"]` | class is not path |
| `>` | `[">", ["get", "render_height"], 50]` | height greater than 50 |
| `<` | `["<", ["get", "rank"], 5]` | rank less than 5 |
| `>=` | `[">=", ["get", "area"], 10000]` | area >= 10000 |
| `<=` | `["<=", ["get", "ele"], 1000]` | elevation <= 1000 |

### 5.2 Membership
| Operator | Syntax | Example |
|---|---|---|
| `in` | `["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]]` | class is in list |
| `!in` | `["!in", ["get", "class"], ["literal", ["path", "track"]]]` | class is NOT in list |
| `has` | `["has", "name"]` | feature has name property |
| `!has` | `["!has", "name:en"]` | feature lacks name:en property |

### 5.3 Logical
| Operator | Syntax | Example |
|---|---|---|
| `all` | `["all", condition1, condition2, ...]` | ALL conditions true |
| `any` | `["any", condition1, condition2, ...]` | ANY condition true |
| `none` | `["none", condition1, condition2, ...]` | NONE true (all false) |
| `!` | `["!", condition]` | NOT condition |

### 5.4 Type Checking
| Operator | Syntax | Example |
|---|---|---|
| `typeof` | `["typeof", ["get", "height"]]` | Returns `"number"`, `"string"`, `"boolean"`, etc. |

### 5.5 Zoom-Based Filters
| Operator | Syntax | Example |
|---|---|---|
| `>= zoom` | `[">=", ["zoom"], 10]` | Only render at zoom 10+ |
| `<= zoom` | `["<=", ["zoom"], 15]` | Only render at zoom 15 or below |
| `all + zoom` | `["all", [">=", ["zoom"], 10], ["<=", ["zoom"], 15]]` | Only render between zoom 10-15 |

---

## 6. ZOOM FUNCTIONS (Zoom-Dependent Values)

Any paint or layout property can change with zoom level.

### 6.1 Step Function (Discrete jumps)
```json
"line-width": {
  "stops": [
    [4, 0.5],    // At zoom 4: 0.5px
    [10, 1],     // At zoom 10: 1px
    [15, 4],     // At zoom 15: 4px
    [20, 12]     // At zoom 20: 12px
  ]
}
```

### 6.2 Exponential Function (Smooth growth)
```json
"line-width": {
  "base": 1.4,  // Exponential base
  "stops": [
    [4, 0.5],
    [20, 30]
  ]
}
```

### 6.3 Expression-Based Zoom
```json
"line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.5, 20, 30]
```

---

## 7. COMPLETE CONTROL MATRIX (What Your UI/AI Can Manipulate)

This is the master list. Every row is a controllable parameter.

### 7.1 Global / Background
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Canvas Background Color | `layers[id="background"].paint.background-color` | color | Any hex/rgb |
| Canvas Opacity | `layers[id="background"].paint.background-opacity` | number | 0-1 |

### 7.2 Water
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Water Color | `layers[id="water"].paint.fill-color` | color | Any |
| Water Opacity | `layers[id="water"].paint.fill-opacity` | number | 0-1 |
| Water Outline | `layers[id="water"].paint.fill-outline-color` | color | Any |
| Water Visibility | `layers[id="water"].layout.visibility` | enum | visible/none |
| River Color | `layers[id="waterway"].paint.line-color` | color | Any |
| River Width | `layers[id="waterway"].paint.line-width` | number | 0+ |
| River Opacity | `layers[id="waterway"].paint.line-opacity` | number | 0-1 |
| River Dash | `layers[id="waterway"].paint.line-dasharray` | array | [dash, gap] |
| River Visibility | `layers[id="waterway"].layout.visibility` | enum | visible/none |
| Water Label Color | `layers[id="water_name"].paint.text-color` | color | Any |
| Water Label Halo | `layers[id="water_name"].paint.text-halo-color` | color | Any |
| Water Label Size | `layers[id="water_name"].layout.text-size` | number | 0+ |
| Water Label Visibility | `layers[id="water_name"].layout.visibility` | enum | visible/none |

### 7.3 Land / Nature
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Forest Color | Filter `landcover` by `class=wood`, then `paint.fill-color` | color | Any |
| Grass Color | Filter `landcover` by `class=grass`, then `paint.fill-color` | color | Any |
| Sand Color | Filter `landcover` by `class=sand`, then `paint.fill-color` | color | Any |
| Ice Color | Filter `landcover` by `class=ice`, then `paint.fill-color` | color | Any |
| Landcover Opacity | `layers[id="landcover"].paint.fill-opacity` | number | 0-1 |
| Landcover Visibility | `layers[id="landcover"].layout.visibility` | enum | visible/none |
| Residential Color | Filter `landuse` by `class=residential`, then `paint.fill-color` | color | Any |
| Commercial Color | Filter `landuse` by `class=commercial`, then `paint.fill-color` | color | Any |
| Industrial Color | Filter `landuse` by `class=industrial`, then `paint.fill-color` | color | Any |
| Park Color | `layers[id="park"].paint.fill-color` | color | Any |
| Park Opacity | `layers[id="park"].paint.fill-opacity` | number | 0-1 |
| Park Visibility | `layers[id="park"].layout.visibility` | enum | visible/none |

### 7.4 Roads (Transportation)
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Motorway Color | Filter `transportation` by `class=motorway`, then `paint.line-color` | color | Any |
| Trunk Color | Filter `transportation` by `class=trunk`, then `paint.line-color` | color | Any |
| Primary Color | Filter `transportation` by `class=primary`, then `paint.line-color` | color | Any |
| Secondary Color | Filter `transportation` by `class=secondary`, then `paint.line-color` | color | Any |
| Tertiary Color | Filter `transportation` by `class=tertiary`, then `paint.line-color` | color | Any |
| Minor Color | Filter `transportation` by `class=minor`, then `paint.line-color` | color | Any |
| Path Color | Filter `transportation` by `class=path`, then `paint.line-color` | color | Any |
| All Road Width | `layers[id="transportation"].paint.line-width` | number/zoom | 0+ |
| All Road Opacity | `layers[id="transportation"].paint.line-opacity` | number | 0-1 |
| Road Blur/Glow | `layers[id="transportation"].paint.line-blur` | number | 0+ |
| Road Cap Style | `layers[id="transportation"].layout.line-cap` | enum | butt/round/square |
| Road Join Style | `layers[id="transportation"].layout.line-join` | enum | bevel/round/miter |
| Road Dash Pattern | `layers[id="transportation"].paint.line-dasharray` | array | [dash, gap] |
| Road Visibility | `layers[id="transportation"].layout.visibility` | enum | visible/none |
| Road Label Color | `layers[id="transportation_name"].paint.text-color` | color | Any |
| Road Label Halo | `layers[id="transportation_name"].paint.text-halo-color` | color | Any |
| Road Label Size | `layers[id="transportation_name"].layout.text-size` | number | 0+ |
| Road Label Visibility | `layers[id="transportation_name"].layout.visibility` | enum | visible/none |
| Show Only Major Roads | `layers[id="transportation"].filter` | filter | `in` motorway/trunk/primary |
| Show Only Paths | `layers[id="transportation"].filter` | filter | `==` class path |
| Hide Tunnels | `layers[id="transportation"].filter` | filter | `!=` brunnel tunnel |
| Hide Bridges | `layers[id="transportation"].filter` | filter | `!=` brunnel bridge |
| Color by Surface | `layers[id="transportation"].paint.line-color` | expression | match surface paved/unpaved |

### 7.5 Buildings
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Building Fill Color | `layers[id="building"].paint.fill-color` | color | Any |
| Building Outline Color | `layers[id="building"].paint.fill-outline-color` | color | Any |
| Building Opacity | `layers[id="building"].paint.fill-opacity` | number | 0-1 |
| Building Visibility | `layers[id="building"].layout.visibility` | enum | visible/none |
| House Number Color | `layers[id="housenumber"].paint.text-color` | color | Any |
| House Number Size | `layers[id="housenumber"].layout.text-size` | number | 0+ |
| House Number Visibility | `layers[id="housenumber"].layout.visibility` | enum | visible/none |
| Color by Height | `layers[id="building"].paint.fill-color` | expression | step on render_height |
| Show Only Tall Buildings | `layers[id="building"].filter` | filter | `>` render_height 50 |

### 7.6 Labels / Text
| Control | JSON Path | Type | Range |
|---|---|---|---|
| City Name Color | Filter `place` by `class=city`, then `paint.text-color` | color | Any |
| City Name Size | Filter `place` by `class=city`, then `layout.text-size` | number | 0+ |
| Country Name Color | Filter `place` by `class=country`, then `paint.text-color` | color | Any |
| Country Name Size | Filter `place` by `class=country`, then `layout.text-size` | number | 0+ |
| Label Halo Color | `layers[id="place"].paint.text-halo-color` | color | Any |
| Label Halo Width | `layers[id="place"].paint.text-halo-width` | number | 0+ |
| Label Halo Blur | `layers[id="place"].paint.text-halo-blur` | number | 0+ |
| Label Font | `layers[id="place"].layout.text-font` | array | Font stack |
| Label Transform | `layers[id="place"].layout.text-transform` | enum | none/uppercase/lowercase |
| Label Letter Spacing | `layers[id="place"].layout.text-letter-spacing` | number | 0+ ems |
| Label Allow Overlap | `layers[id="place"].layout.text-allow-overlap` | boolean | true/false |
| Place Visibility | `layers[id="place"].layout.visibility` | enum | visible/none |
| Show Only Cities | `layers[id="place"].filter` | filter | `in` class city/town |
| Show Only Countries | `layers[id="place"].filter` | filter | `==` class country |
| Rank Filter | `layers[id="place"].filter` | filter | `<=` rank 5 |

### 7.7 POIs (Points of Interest)
| Control | JSON Path | Type | Range |
|---|---|---|---|
| POI Icon Color | `layers[id="poi"].paint.icon-color` | color | Any |
| POI Icon Size | `layers[id="poi"].layout.icon-size` | number | 0+ |
| POI Text Color | `layers[id="poi"].paint.text-color` | color | Any |
| POI Text Size | `layers[id="poi"].layout.text-size` | number | 0+ |
| POI Visibility | `layers[id="poi"].layout.visibility` | enum | visible/none |
| Show Only Hospitals | `layers[id="poi"].filter` | filter | `==` class hospital |
| Show Only Shops | `layers[id="poi"].filter` | filter | `==` class shop |
| Show Only Restaurants | `layers[id="poi"].filter` | filter | `in` class fast_food/cafe/restaurant |
| Show Only Top POIs | `layers[id="poi"].filter` | filter | `<=` rank 5 |
| Show Named POIs Only | `layers[id="poi"].filter` | filter | `has` name |

### 7.8 Boundaries
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Country Border Color | Filter `boundary` by `admin_level=2`, then `paint.line-color` | color | Any |
| State Border Color | Filter `boundary` by `admin_level=4`, then `paint.line-color` | color | Any |
| Border Width | `layers[id="boundary"].paint.line-width` | number | 0+ |
| Border Dash | `layers[id="boundary"].paint.line-dasharray` | array | [dash, gap] |
| Border Opacity | `layers[id="boundary"].paint.line-opacity` | number | 0-1 |
| Border Visibility | `layers[id="boundary"].layout.visibility` | enum | visible/none |
| Show Disputed Borders | `layers[id="boundary"].filter` | filter | `==` disputed 1 |
| Hide Disputed Borders | `layers[id="boundary"].filter` | filter | `==` disputed 0 |
| Show Maritime Borders | `layers[id="boundary"].filter` | filter | `==` maritime 1 |

### 7.9 Global Effects
| Control | JSON Path | Type | Range |
|---|---|---|---|
| Global Transition Duration | `transition.duration` | number | 0+ ms |
| Global Transition Delay | `transition.delay` | number | 0+ ms |
| Light Color (3D) | `light.color` | color | Any |
| Light Intensity (3D) | `light.intensity` | number | 0-1 |
| Light Position (3D) | `light.position` | array | [radial, azimuth, polar] |

---

## 8. LAYER ORDER RULES

The `layers` array is processed **top to bottom** (painter's algorithm). Later layers paint OVER earlier layers.

**Standard order:**
1. `background`
2. `landcover`
3. `landuse`
4. `park`
5. `water`
6. `aeroway`
7. `building`
8. `transportation` (roads)
9. `boundary`
10. `waterway`
11. `water_name`
12. `transportation_name`
13. `place`
14. `poi`
15. `aerodrome_label`
16. `housenumber`

**If you reorder:** Putting `building` BEFORE `transportation` makes roads paint OVER buildings (wrong). Putting `water` AFTER `landuse` makes land paint over water (wrong). Your UI should allow reordering but warn about visual hierarchy breaks.

---

## 9. AI AGENT MANIPULATION REFERENCE

When your AI agent generates style changes, it outputs **operations**, not full styles.

### Operation Types
| Type | Target | Example |
|---|---|---|
| `setPaintProperty` | `layers[id].paint.property` | Change water color to blue |
| `setLayoutProperty` | `layers[id].layout.property` | Hide a layer |
| `setFilter` | `layers[id].filter` | Show only motorways |
| `moveLayer` | `layers` array index | Reorder layers |
| `addLayer` | New layer object | Add housenumber layer |
| `removeLayer` | Layer id | Remove a layer |
| `setLight` | `light` object | Change 3D lighting |

### AI Personality Presets
| Personality | Operations Applied |
|---|---|
| **Minimalist** | `setLayoutProperty` visibility="none" on poi, transportation_name, place, housenumber, aerodrome_label |
| **Maximalist** | `setLayoutProperty` visibility="visible" on all layers. Saturate colors. Increase text-size. |
| **Blueprint** | `setPaintProperty` background-color="#001f3f", water fill-color="#001f3f" opacity 0.3, transportation line-color="#7FDBFF", building fill-outline-color="#7FDBFF" fill-color="transparent" |
| **Neon** | `setPaintProperty` background-color="#000000", transportation line-color="#FF00FF" line-blur=4, building fill-color="#111111" fill-outline-color="#00FFFF" |
| **Nature** | `setLayoutProperty` visibility="none" on transportation, building, poi, place. Set landcover colors to greens/browns. |
| **Transit** | `setFilter` on transportation to `in` motorway/trunk/primary/secondary. Set line-width=4, line-cap="round". Hide all other layers. |
| **Archivist** | Mute all colors to sepia. Set text-font to serif. Add fill-pattern to landcover. |
| **Night** | Dark background. Light text halos. Reduced building opacity. |
| **Data Density** | `setPaintProperty` building fill-color based on render_height step function. Filter place by rank <= 5. |

---

## 10. WHAT'S IN LIBERTY vs WHAT'S AVAILABLE

| Layer | In Liberty Style? | Available in Tiles? | You Can Add It? |
|---|---|---|---|
| background | Yes | N/A (style-only) | N/A |
| water | Yes | Yes | Already there |
| waterway | Yes | Yes | Already there |
| landcover | Yes | Yes | Already there |
| landuse | Yes | Yes | Already there |
| park | Yes | Yes | Already there |
| boundary | Yes | Yes | Already there |
| building | Yes | Yes | Already there |
| transportation | Yes | Yes | Already there |
| transportation_name | Yes | Yes | Already there |
| place | Yes | Yes | Already there |
| poi | Partial (some classes) | Yes | Add filter for more classes |
| water_name | Yes | Yes | Already there |
| housenumber | **NO** | **YES** | **Add new layer** |
| mountain_peak | **NO** | **YES** | **Add new layer** |
| aerodrome_label | **NO** | **YES** | **Add new layer** |
| aeroway | **NO** | **YES** | **Add new layer** |

**To add a missing layer, insert this into the layers array:**

```json
{
  "id": "housenumber",
  "type": "symbol",
  "source": "openmaptiles",
  "source-layer": "housenumber",
  "minzoom": 17,
  "layout": {
    "text-field": ["get", "housenumber"],
    "text-font": ["Noto Sans Regular"],
    "text-size": 10
  },
  "paint": {
    "text-color": "#666666",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1
  }
}
```

This references the `housenumber` source-layer from the tiles (which always existed) and styles it. Liberty just didn't include it.

---

## 11. QUICK REFERENCE: Common Style Presets

### Minimal (Roads + Water Only)
```json
{
  "layers": [
    { "id": "background", "type": "background", "paint": { "background-color": "#ffffff" } },
    { "id": "water", "type": "fill", "source": "openmaptiles", "source-layer": "water", "paint": { "fill-color": "#e0e0e0" } },
    { "id": "transportation", "type": "line", "source": "openmaptiles", "source-layer": "transportation", "paint": { "line-color": "#333333", "line-width": 1 } }
  ]
}
```

### Dark Mode
```json
{
  "layers": [
    { "id": "background", "type": "background", "paint": { "background-color": "#1a1a1a" } },
    { "id": "water", "type": "fill", "source": "openmaptiles", "source-layer": "water", "paint": { "fill-color": "#2a3f5f" } },
    { "id": "transportation", "type": "line", "source": "openmaptiles", "source-layer": "transportation", "paint": { "line-color": "#444444", "line-width": 1 } },
    { "id": "building", "type": "fill", "source": "openmaptiles", "source-layer": "building", "paint": { "fill-color": "#333333", "fill-opacity": 0.5 } },
    { "id": "place", "type": "symbol", "source": "openmaptiles", "source-layer": "place", "layout": { "text-field": ["get", "name"], "text-font": ["Noto Sans Regular"], "text-size": 12 }, "paint": { "text-color": "#cccccc", "text-halo-color": "#1a1a1a", "text-halo-width": 2 } }
  ]
}
```

### Circuit Board (Major Roads Only)
```json
{
  "layers": [
    { "id": "background", "type": "background", "paint": { "background-color": "#000000" } },
    { "id": "transportation", "type": "line", "source": "openmaptiles", "source-layer": "transportation", "filter": ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]], "paint": { "line-color": ["match", ["get", "class"], "motorway", "#ff0066", "trunk", "#ff6600", "primary", "#ffcc00", "#ffffff"], "line-width": 3, "line-blur": 2 } }
  ]
}
```

---


 ## What's NOT in Your Config Sheet (The Extra Stuff)

Your uploaded doc covers 95%. Here's the missing 5% that matters for a wallpaper app:

### 1. Sprite Sheets (Icons & Patterns)
**What it is:** A single PNG image containing all icons + a JSON index file mapping names to coordinates. Liberty's sprite URL is `https://tiles.openfreemap.org/sprites/liberty`. The PNG contains icons for hospitals, schools, airports, parks, etc. The JSON says *"hospital icon is at pixel 0,0, size 20×20."*

**Why you care:** You can create your own sprite sheet. Design 50 icons in Figma, pack them into one PNG, write the index JSON, host it on your CDN. Now every hospital is a heart emoji, every park is a tree, every airport is a plane. This is how you get custom iconography.

**How to use it in style JSON:**
```json
"sprite": "https://your-cdn.com/sprites/my-custom-icons",
```
Then in a layer: `"icon-image": "my-custom-park-icon"`

### 2. SDF Fonts (Why Text Looks the Same Everywhere)
**What it is:** MapLibre doesn't use browser fonts. It downloads binary glyph files where each character is pre-rendered as a **Signed Distance Field** — a grayscale image where white = inside the letter, black = outside, gray = the edge. This allows text to scale to any size without pixelation and renders identically on all devices.

**Why you care:** You can host your own font glyphs. Want a brutalist map with monospace labels? A romantic map with script fonts? Generate SDF glyph files from any TTF/OTF font using `fontnik` or `glyph-pbf-composite`, host them, point your style at them.

### 3. Atmosphere, Fog, Sky (The "Vibe" Layer)
MapLibre 2.0+ supports atmospheric rendering. This is huge for wallpapers:

| Property | What It Does | Wallpaper Use |
|---|---|---|
| `sky.type` | `"atmosphere"` or `"gradient"` | Atmosphere = realistic sky dome |
| `sky.atmosphere-color` | Sky color near horizon | Sunset gradients |
| `sky.atmosphere-halo-color` | Sky color at zenith | Deep blue top |
| `sky.atmosphere-sun` | Sun position `[azimuth, altitude]` | Directional lighting |
| `sky.atmosphere-sun-intensity` | How bright the sun is | Golden hour intensity |
| `fog.range` | `[near, far]` where fog starts/ends | Misty distant mountains |
| `fog.color` | Fog color | Atmospheric depth |
| `fog.horizon-blend` | How fog blends with sky | Seamless horizon |

**Example — Golden Hour Wallpaper:**
```json
{
  "sky": {
    "type": "atmosphere",
    "atmosphere-color": "#ff9966",
    "atmosphere-halo-color": "#4a90d9",
    "atmosphere-sun": [270, 15],
    "atmosphere-sun-intensity": 15
  },
  "fog": {
    "range": [2, 12],
    "color": "#ffccaa",
    "horizon-blend": 0.3
  }
}
```

### 4. Terrain (3D Landscape Without Buildings)
For dramatic mountain/valley wallpapers before you add 3D buildings:

```json
"sources": {
  "terrain": {
    "type": "raster-dem",
    "url": "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
    "tileSize": 256
  }
},
"terrain": {
  "source": "terrain",
  "exaggeration": 1.5
}
```

Then add a `hillshade` layer:
```json
{
  "id": "hillshade",
  "type": "hillshade",
  "source": "terrain",
  "paint": {
    "hillshade-shadow-color": "#000000",
    "hillshade-highlight-color": "#ffffff",
    "hillshade-accent-color": "#444444",
    "hillshade-exaggeration": 0.5
  }
}
```

### 5. Raster Overlays (Satellite + Vector Hybrid)
You can mix raster imagery with vector styling:

```json
"sources": {
  "satellite": {
    "type": "raster",
    "tiles": ["https://your-satellite-url/{z}/{x}/{y}.jpg"],
    "tileSize": 256
  }
}
```
Then add a raster layer with low opacity underneath your vector roads:
```json
{
  "id": "satellite-base",
  "type": "raster",
  "source": "satellite",
  "paint": { "raster-opacity": 0.4 }
}
```
Now you have satellite photo + your styled roads on top. **This is a unique wallpaper look** most apps don't offer.

### 6. Custom Layers (WebGL Shaders)
For truly unique wallpapers, you can inject raw WebGL shaders into MapLibre:

- **Particle systems** — animated flowing lines along roads (like a living circuit board)
- **Noise textures** — grain overlays for a film/paper aesthetic
- **Glow/bloom post-processing** — neon halos around buildings

This is advanced. Use it for a "Pro" tier feature later.

### 7. Globe Projection
MapLibre 3.0+ supports `projection: "globe"`. Instead of flat Mercator, you get a 3D sphere. Zoomed out = planet view. Zoomed in = transitions to flat. Stunning for "world map" wallpapers.

```json
"projection": { "type": "globe" }
```

### 8. The `metadata` Field (Your App's Secret Storage)
```json
"metadata": {
  "mapwallpaper:author": "user123",
  "mapwallpaper:createdAt": "2026-08-24",
  "mapwallpaper:tags": ["dark", "minimal", "gold"],
  "mapwallpaper:downloads": 47,
  "mapwallpaper:isPremium": false
}
```
MapLibre ignores this. You use it to store app-specific data inside the style JSON itself. When someone shares a template, the metadata travels with it.

### 9. `import` and `slot` (MapLibre 3.0+)
You can compose styles from fragments:
```json
"imports": [
  {
    "id": "liberty-base",
    "url": "https://tiles.openfreemap.org/styles/liberty",
    "data": { ... }
  }
],
"layers": [
  { "id": "my-overlay", "slot": "top", ... }
]
```
This lets you import a base style and inject your custom layers into specific "slots" without rewriting the whole thing. Useful for template inheritance.

### 10. Line Gradient (The Forgotten Killer Feature)
```json
"paint": {
  "line-color": [
    "interpolate",
    ["linear"],
    ["line-progress"],
    0, "#ff0000",
    0.5, "#00ff00", 
    1, "#0000ff"
  ]
}
```
This colors a road based on its length — red at start, green in middle, blue at end. Looks like a **transit heatmap** or **flow visualization**. Stunning for artistic wallpapers.

---