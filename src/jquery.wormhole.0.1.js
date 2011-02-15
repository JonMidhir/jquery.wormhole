/*  Worm Hole

	Usage: $('selector').isWormHole(group, objectsref, stopCallback); where:
		group is an arbitrary name for this group of worm holes,
		objectsref defines all child objects that can pass through the worm hole,
		stopCallback is a callback that is called when the dragging stops on the other side of the wormhole
		
	V0.1, see ReadMe for details etc etc
	
	(c) Copyright John M. Hope 2011. Released under the Don't be a Dick (DD) license. */


jQuery.fn.isWormHole = function(group, selector, stopCallback) {
	var $thisObject = this;
	$thisObject.css('overflow', 'hidden');
	$thisObject.data('wormGroup', group);
	$thisObject.addClass('wormgroup-' + group); // This really shouldn't be necessary, but until we can find others via their jQuery .data() attributes it is
	var containmentCoords = [$thisObject.offset().left, $thisObject.offset().top - $thisObject.height(), $thisObject.offset().left + liWidth, $thisObject.offset().top + ($thisObject.height() * 2)];
	$thisObject.delegate(selector, 'mouseover', function() {
		if ($(this).data('isWorm') != true && $(this).data('isClone') != true) { // All elements now and in the future get everything in this if statement done to them once
			$(this).draggable( "option", "containment", containmentCoords);
			$(this).isWorm(group, $thisObject, stopCallback);
		}
	});
}

jQuery.fn.isWorm = function(group, parent, stopCallback) {
	if (this.data('isWorm') != true) { // if it's not already a worm
		var southLimit = parent.height();
	
		var $nextWormHole = parent.next('.wormgroup-' + group);
		var $cloneWorm = this.clone(true);
		$cloneWorm.data('isClone', true);
		var cloneContainmentCoords = [$nextWormHole.offset().left, $nextWormHole.offset().top - $nextWormHole.height(), $nextWormHole.offset().left + liWidth, $nextWormHole.offset().top + $nextWormHole.height() + 50];
		//$cloneWorm.draggable( "option", "containment", cloneContainmentCoords);
		
		var originalPos = this.position();
		
		$(this).data('isWorm', true);
		
		this.bind("drag", function(event, ui) { //pairs the two so that both move when the other is grabbed
			if ($(this).position().top + $(this).height() > southLimit) { // if the div is approaching a wormhole limit
				var newHeight = $(this).position().top - parent.height();
				$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone
				$nextWormHole.append($cloneWorm);
			}
		});
		
		this.bind("dragstop", function(event, ui) { 
			if ($(this).position().top > southLimit) { // if it's beyond the southern limit, ie the clone should be the actual div now
				var draggableOptions = $(this).data("draggable").options; // get the options of the original draggable
				
				$(this).css('top', $cloneWorm.position().top + 'px'); // vertically position the original before ...
				$cloneWorm.replaceWith($(this)); //  ... replacing the clone with it
				
				stopCallback; // perform any callbacks specified by the user
				
				$(this).unbind('drag').unbind('dragstop'); // remove previous bound handlers
				
				$(this).draggable(draggableOptions); // add the old options from the original
				
				$(this).data('isWorm', false); // remove the isWorm so that this function is run again for the newly placed original
				
			} else if ($(this).position().top + $(this).height() > southLimit - 10) { // if the div is approaching a wormhole limit
				var newHeight = $(this).position().top - 720;
				$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone
			} else {
				$cloneWorm.detach();
			}
		});
	}
}