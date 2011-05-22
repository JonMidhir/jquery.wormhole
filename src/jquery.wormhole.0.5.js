/*  Worm Hole

	Usage: $('selector').isWormHole(group, objectsref, stopCallback); where:
		group is an arbitrary name for this group of worm holes,
		objectsref defines all child objects that can pass through the worm hole,
		stopCallback is a callback that is called when the dragging stops on the other side of the wormhole
		
	V0.1, see ReadMe for details etc etc
	
	(c) Copyright John M. Hope 2011. Released under the Don't be a Dick (DD) license. */

(function($){
	$.fn.isWormHole = function(options) {
		
			var defaults = {
				group: 'default', 
				selector: '*', 
				stop: function(){}
			};

			var options = $.extend(defaults, options);
			
			this.each(function() {

			var $thisObject = $(this);
			$thisObject.css('overflow', 'hidden');
			if ($thisObject.css('position') == "static") {
				$thisObject.css('position', 'relative');
			}
			
			$thisObject.find(options.selector).each(function() {
				if($(this).css('position') != 'absolute') {
					$(this).css('position', 'absolute');
				}
			});
			$thisObject.data('wormGroup', options.group);
			$thisObject.addClass('wormgroup-' + options.group); // This really shouldn't be necessary, but until we can find others via their jQuery .data() attributes it is
			$thisObject.delegate(options.selector, 'mouseover', function() {

				if ($(this).data('isWorm') != true && $(this).data('isClone') != true) { // All elements now and in the future get everything in this if statement done to them once
					var containmentCoords = [$thisObject.offset().left, $thisObject.offset().top - $thisObject.height(), $thisObject.offset().left + $thisObject.width() - $(this).width(), $thisObject.offset().top + ($thisObject.height() * 2)];
					$(this).draggable( "option", "containment", containmentCoords);
					$(this).draggable( "option", "stack", options.selector );
					$(this).isWorm(options.group, $thisObject, options.stop);
				}
			});
		});
	};

	$.fn.isWorm = function(group, parent, stopCallback) {
		if (this.data('isWorm') != true) { // if it's not already a worm
			var $nextWormHole = parent.next('.wormgroup-' + group);
			var $prevWormHole = parent.prev('.wormgroup-' + group);
			var $cloneWorm;
			//alert($cloneWorm);
			this.bind("dragstart", function(event, ui) {
			  if ($cloneWorm == undefined) {
				$cloneWorm = $(this).clone(true);
				$cloneWorm.data('isClone', true);
				$(this).data('isWorm', true);
			  }
			});
			

			this.bind("drag", function(event, ui) { //pairs the two so that both move when the other is grabbed
				if ($(this).position().top + $(this).height() > parent.height() && $nextWormHole.length > 0) { // if the div is approaching a southern wormhole limit
					var newHeight = $(this).position().top - parent.height();
					$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone
					if (!$(this).data('hasClone')) {
						$nextWormHole.append($cloneWorm);
						$(this).data('hasClone', true);
					}
				} else if ($(this).position().top < 0 && $prevWormHole.length > 0){
					var newHeight = $(this).position().top + parent.height();
					$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone
					if (!$(this).data('hasClone')) {
						$prevWormHole.append($cloneWorm);
						$(this).data('hasClone', true);
					}
				}
			});

			this.bind("dragstop", function(event, ui) { 
				if ($(this).position().top > parent.height()) { // if it's beyond the southern limit, ie the clone should be the actual div now
					var draggableOptions = $(this).data("draggable").options; // get the options of the original draggable

					$(this).css('top', $cloneWorm.position().top + 'px'); // vertically position the original before ...
					$cloneWorm.replaceWith($(this)); //  ... replacing the clone with it
					delete $cloneWorm;

					stopCallback; // perform any callbacks specified by the user

					$(this).unbind('drag').unbind('dragstop'); // remove previous bound handlers

					$(this).draggable(draggableOptions); // add the old options from the original

					$(this).data('isWorm', false).data('hasClone', false); // remove the isWorm so that this function is run again for the newly placed original

					} else if ($(this).position().top + $(this).height() > parent.height()) { // if the div is approaching a southern wormhole limit
						var newHeight = $(this).position().top - parent.height();
						$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone

					} else if ($(this).position().top <= (0 - $(this).height())) { // if it's beyond the northern limit (0)
						var draggableOptions = $(this).data("draggable").options; // get the options of the original draggable

						$(this).css('top', $cloneWorm.position().top + 'px'); // vertically position the original before ...
						$cloneWorm.replaceWith($(this)); //  ... replacing the clone with it / the old switcheroo
						delete $cloneWorm;

						stopCallback; // perform any callbacks specified by the user

						$(this).unbind('drag').unbind('dragstop'); // remove previous bound handlers

						$(this).draggable(draggableOptions); // add the old options from the original

						$(this).data('isWorm', false).data('hasClone', false); // remove the isWorm so that this function is run again for the newly placed original
					} else if ($(this).position().top < 0) {
						var newHeight = $(this).position().top + parent.height();
						$cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px"); //add it to the clone
					} else {
					$cloneWorm.detach();
					$(this).data('hasClone', false);
					//alert($cloneWorm.parent().width() == null); // is cloneworm attached to the DOM?
				}
			});
		}
	};
	
})(jQuery);