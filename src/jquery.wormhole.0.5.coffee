# Worm Hole
#
# Usage: $('selector').isWormHole(group, objectsref, stopCallback); where:
#	group is an arbitrary name for this group of worm holes,
#	objectsref defines all child objects that can pass through the worm hole,
#	stopCallback is a callback that is called when the dragging stops on the other side of the wormhole
#
# V0.1, see ReadMe for details etc etc
#
# (c) Copyright John M. Hope 2011. Released under the Don't be a Dick (DD) license.

$ = jQuery

$.fn.wormHole = (options) ->
	
  defaults =
    group: 'default'
    selector: '*'
    stop: ->

  options = $.extend(defaults, options)

  @each ->
    $thisObject = $(@)
    $thisObject.css("overflow", 'hidden')
    if $thisObject.css('position') == "static"
      $thisObject.css('position', 'relative')

    $thisObject.find(options.selector).each ->
      if $(@).css('position') != 'absolute'
        $(@).css('position', 'absolute')

    $thisObject.data('wormGroup', options.group)
    $thisObject.addClass('wormgroup-' + options.group)
    $thisObject.delegate options.selector, 'mouseover', ->
      if $(@).data('isWorm') != true && $(@).data('isClone') != true
        containmentCoords = [$thisObject.offset().left, $thisObject.offset().top - $thisObject.height(), $thisObject.offset().left + $thisObject.width() - $(this).width(), $thisObject.offset().top + ($thisObject.height() * 2)]
        $(@).draggable("option", "containment", containmentCoords)
        $(@).draggable("option", "stack", options.selector)
        $(@).isWorm(options.group, $thisObject, options.stop)

$.fn.worm = (group, parent, stopCallback = ->) ->
  if (@data('isWorm') != true)
    $nextWormHole = parent.next('.wormgroup-' + group)
    $prevWormHole = parent.prev('.wormgroup-' + group)
    @bind 'dragstart', (event, ui) ->
      if ($cloneWorm == undefined)
        $cloneWorm = $(this).clone(true)
        $cloneWorm.data('isClone', true)
        $(this).data('isWorm', true)

    @bind 'drag', (event, ui) ->
      if $(this).position().top + $(this).height() > parent.height() && $nextWormHole.length > 0
        newHeight = $(this).position().top - parent.height()
        $cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px")
        if !$(this).data('hasClone')
          $nextWormHole.append($cloneWorm)
          $(this).data('hasClone', true)
        else if $(this).position().top < 0 && $prevWormHole.length > 0
          newHeight = $(this).position().top + parent.height()
          $cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px")
          if !$(this).data('hasClone')
            $prevWormHole.append($cloneWorm)
            $(this).data('hasClone', true)

    @bind "dragstop", (event, ui) ->
      if $(this).position().top > parent.height()
        draggableOptions = $(this).data("draggable").options
 
        $(this).css('top', $cloneWorm.position().top + 'px')
        $cloneWorm.replaceWith($(this))
        delete $cloneWorm

        stopCallback

        $(this).unbind('drag').unbind('dragstop')
        $(this).draggable(draggableOptions)
        $(this).data('isWorm', false).data('hasClone', false)

      else if $(this).position().top + $(this).height() > parent.height()
        newHeight = $(this).position().top - parent.height()
        $cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px")

      else if $(this).position().top <= (0 - $(this).height())
        draggableOptions = $(this).data("draggable").options
        $(this).css('top', $cloneWorm.position().top + 'px')
        $cloneWorm.replaceWith($(this))
        delete $cloneWorm

        stopCallback

        $(this).unbind('drag').unbind('dragstop')

        $(this).draggable(draggableOptions)

        $(this).data('isWorm', false).data('hasClone', false)
      else if $(this).position().top < 0
        newHeight = $(this).position().top + parent.height()
        $cloneWorm.css('left', $(this).css('left')).css('opacity', $(this).css('opacity')).css('top', newHeight + "px")
      else
        $cloneWorm.detach()
        $(this).data('hasClone', false)
