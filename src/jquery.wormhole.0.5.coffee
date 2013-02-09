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

$.fn.isWorm = ->
  $(@).data('isWorm') == true || $(@).data('isClone') == true

$.fn.explicitlyPosition = ->
  $(@).css('position', 'relative') if $(@).css('position') == "static"

$.fn.explicitlyPositionAbsolute = ->
  $(@).css('position', 'absolute') if $(@).css('position') != 'absolute'

$.fn.containmentCoordinates = ->
  offset = $(@).offset()
  [offset.left, offset.top - $(@).height(), offset.left + $(@).width() - $(@).width(), offset.top + ($(@).height() * 2)]

$.fn.cloneAsWorm = (deep) ->
  $cloneWorm = $(this).clone(deep).data('isClone', true)

$.fn.wormHole = (options) ->
	
  defaults =
    group: 'default'
    selector: '*'
    stop: ->

  options = $.extend(defaults, options)

  @each ->
    $thisObject = $(@)
    $thisObject.css("overflow", 'hidden')
    $thisObject.explicitlyPosition()

    $thisObject.find(options.selector).each ->
      $(@).explicitlyPositionAbsolute()

    $thisObject.data('wormGroup', options.group)
    $thisObject.addClass('wormgroup-' + options.group)
    $thisObject.delegate options.selector, 'mouseover', ->
      unless $(@).isWorm()
        $(@).draggable("option", "containment", $(@).containmentCoordinates())
        $(@).draggable("option", "stack", options.selector)
        $(@).worm(options.group, $thisObject, options.stop)

$.fn.worm = (group, parent, stopCallback = ->) ->
  unless @isWorm()
    $nextWormHole = parent.next('.wormgroup-' + group)
    $prevWormHole = parent.prev('.wormgroup-' + group)

    $(@).data('isWorm', true)
    $cloneWorm = $(this).cloneAsWorm(true)

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
        draggableOptions = $(this).data("uiDraggable").options
 
        $(this).css('top', $cloneWorm.position().top + 'px')
        $cloneWorm.replaceWith($(this))

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
  @
