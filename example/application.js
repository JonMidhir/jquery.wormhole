$(document).ready(function() {
	$('.draggable').draggable({
		cursor: 'move'
	});
	$('div.wh').wormHole({
			group: 'wormholes', 
			selector: '.draggable'
	});
});