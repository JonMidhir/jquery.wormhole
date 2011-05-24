# jQuery WormHole Plugin

For use with jQuery-ui draggable. Allows child objects matching a defined selector to be dragged past the boundaries of their container and enter at the boundary of another. When an acceptable child object is dragged past the edge of it's container it starts to appear at the opposite edge of the next container in the group of worm holes.

Useful for calendar style applications, where events should be able to span multiple days. Extracted from the Rotify app [rotify.com](http://www.rotify.com).

## Usage

Requires jQuery 1.4+ and jQuery-UI. 

Define container objects matching 'selector' as wormholes:

	$('selector').isWormHole({options});

That's it!

Options: 

- group: string identifier, allows you to have different groups of wormholes on the same page
- selector: limits the objects that can pass through the wormhole to those matching this selector

Events:

- stop: a callback function that is called when a child object is dropped on the other side of the wormhole

Delegates to new objects created in the container, so children can be dragged through the worm hole as soon as they're created.

## Issues and Todos

Very early stage:

- Create an argument that allows active edges to be defined: north, south, east, west, horizontal, vertical and array ([east, north])
- A child object must be dropped on the other side of a wormhole before it can be dragged on through the next.

## Supported Browsers

Tested on: 

- FireFox 3.6+ & 4beta
- Chrome
- Safari
	
## Documentation and demos

Documentation and demo available at: http://opensource.rotify.com/wormhole

## Authors

Originally developed by John M. Hope [github.com/JonMidhir](http://github.com/jonmidhir) for the Rotify project [rotify.com](http://www.rotify.com)