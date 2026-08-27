You need to plan and make the next iteration of this app but this can be very complex. You need to make it as simple code and logic as possible for maximum future maintainability by humans. properly cleanly build these features now.
And whatever simplification modifying of current things needed do so.
Very basic level states, basic functions, really simple stuff from here on out. I dont think usecallbk or usememo is needed anywhere. useref can be helpful some places.
---

first the customize menu on the map, make the contents inside independent of the menu because it is going to house all sorts of things now, and use max-h or min-h with transition-all or whatever so I have the smooth expand and shrinking when inside contents are changed. the transitionbox thing is more or less working good, but add opacity-0 and opacity-100 to inactive and active ones.
make sure the current location being stared at is kept track of (the center thing, maybe in provider or something decide whats best).
first let's begin with making a new concept, (component or function whatever you want to call it) of showing an entity (with proper zoom level, either let maplibre decide, if not possible then store those somewhere), entity like roads, paths of all sorts, water and other things, whichever I want, *closest* to what Im staring at right now, name this ClosestEntityPreview. I think maplibre already has an inbuilt thing for this queryRenderedFeatures .

time to change the whole customization menu.
the button will look same as it is right now but the contents will be held in a drawer (side=bottom) (shadcn ofcourse) for mobile and the popover like thing thats there right now for desktop. but when opened, the trigger will disappear and the opened components will be flush with bottom.

inside, normally when the "Create" button (this button functionality is explained later below) isnt clicked, there will be just customizations for the map. Posters, Templates, then a vertical divider and the options like land, water, roads, etc whatever is currently there. these options, make them reusable because they will be used a lot, these look like circle with a letter in them (first letter of option name, just stick to this for now) and below circle is text-xs opacity-70 name of option. make the naming of all the components to be made very solid, or its gonna be confusing for me.
I dont think from here on out the json structure is going to save us configure all that option, the styling ones are good tho, keep those. but from here on, maximum ones will have onclick functions in spot thats why we making the options a reusable thing.
Here all the buttons will open a submenu and their height will differ, jsut make the overall container and the transitionbox shrink and expand smoothly using those things I said. NO MANUAL CALCULATION OF HEIGHT USING JS LIKE A CUNT. and make sure the order of screens are setup properly so the transition direction is proper.
Poster button: this will take to transitionbox where the premade posters will be there (just open and say "posters here" will make this feature later).
Templates button: will take to transitionbox with a 2 col grid, which shows maps rendered of the exact location user is staring at right now with different templates applied to it. for now there is only one, make a separate templates folder and store the different templates files there, name it something proper and a place where these are properly imported and exported as proper array which will help map into separate maps. this section, the maps are not interractable. and make sure to here use a shadcn scrollarea, its already installed. onclick will apply that template to our map.

For the other options for styling the map like land etc, theres work to be done there too.
> In building menu, keep option for height multipliyer slider too, going from 1x to 5x.
> needed layers: runaways, taxiways, aprons, helipads, railways, every types of paths paths put these in roads submenu.
> all road (all sorts of paths) and water things (rivers, etc) and land things (forest, grass, sand, etc) and Boundaries (country, state borders, etc)  separate color picker, thickness multiplier, opacity (with percentage), glow slider.
put all these things from notes\ULTIMATE_MAP_STYLE_CONFIG_SHEET.md (only for roads, water, land, boundary things, nothing else) (with proper glow slider, opacity slider, width multipliyer slider), show toggle button in the submenus.
and the ClosestEntityPreview thing I said before this has an use here, let's say we are in the submenu roads and we can see the further customization options like paths, etc. but for the roads level itself, there are controlls too, which apply to all the things below, like show toggle, opacity slider, etc controlls. after these, put ClosestEntityPreview showing nearest road (maybe closes dense roads interseciton thing is best, you be the judge, what queries you can perform well here) show this then the later on submenus. ClosestEntityPreview will have the exact styles applied to it thats applied to the main map, but its not interractable. in the further submenus, the cotnrolls are more or less same, show the UI controls then ClosestEntityPreview. make sure the componenet ClosestEntityPreview is "h-100 rounded-sm border w-full".
continue same for other sections like water things, land, border, building etc.


---

the "Share" button. this is in app\page.tsx line 20, this will open the create mode where user can create their own poster here.
when in create mode, the controll of the customize menu below as well as the whole map thing will change. what should not change is the current location and style.
when create button is pressed the following things will happen:
> the map currently where it is right now will stay there, whatever the user's device aspect ratio or whatever things, zoom level, everything will be there, basically freezing the map.
> there will be a canvas thing, on which the whole edits are to be done. this canvas thing will be under the map, and portrait aspect ratio by default, kinda like the default photoshop empty page. there will be something called a "margin" just a value, a soft value, no hard enforcements. when create is pressed, the map will freeze and shrink to fit this canvas within its margin (lets say margin is 50px so make it fit aligned top of the portrait canvas with 50px gap from all sides, the aspectratio should be preserved tho.) there will be separate aspect raitos for the map and canvas.
> in create mode the customize menu optionswill be "Canvas", "Map", "Texts" . these options will open further submenus, but leave it for now.

