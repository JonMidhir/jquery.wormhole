# jQuery WormHole Plugin

For use with jQuery-ui draggable. Allows child objects matching a defined selector to be dragged past the boundaries of their container and enter at the boundary of another. When an acceptable child object is dragged past the edge of it's container it starts to appear at the opposite edge of the next container in the group of worm holes.

Useful for calendar style applications, where events should be able to span multiple days. Extracted from the Rotify app (www.rotify.com).

## Usage

Define container objects matching 'selector' as wormholes:

	$('selector').isWormHole(group, childselector, stopCallback);

That's it!

- group: string identifier, allows you to have different groups of wormholes on the same page
- childselector: limits the objects that can pass through the wormhole to those matching this selector
- stopCallback: a callback function that is called when a child object is dropped on the other side of the wormhole

Delegates to new objects created in the container, so children can be dragged through the worm hole as soon as they're created.

## Issues and Todos

Very early stage:

- Arguments should be accepted as an options hash
- Currently only works with the southern edge of the container (so objects exit through the north edge of the next wormhole)
- Create an argument that allows active edges to be defined: north, south, east, west, horizontal, vertical and array ([east, north])
- A child object must be dropped on the other side of a wormhole before it can be dragged on through the next.

## Supported Browsers

Tested on: 
- FireFox 3.6+ & 4beta
- Chrome
- Safari
	
## Documentation and demos

Coming soon

## Authors

Originally developed by John M. Hope (http://github.com/jonmidhir) for the Rotify project (www.rotify.com)