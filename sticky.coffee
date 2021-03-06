define ["jquery"], ($) ->
  class Sticky
    constructor: (@elem, @offsetTop, @offsetBottom) ->
      that = this
      @offsetTop ?= 0
      @offsetTop = +@offsetTop
      @width ?= 0
      @state = ''

      do @init
      @position = {}
      
      @topPossible = on
      @getPosition()
      
      scroll = =>
        @getPosition()
        do @checkHeight

      scroll()
      $(window).scroll scroll
      $(window).resize scroll
       
    init: ->
      @width = @elem.outerWidth()

      if @elem.parent().outerHeight() == @elem.parent().parent().height()
        @state = 'disable'
        return

      @elem.parent().parent().css position: "relative"
      @elem.parent().css position: "absolute", top: 0, bottom: 0
      @elem.css width: "#{@width}px"


    getPosition: ->
      @position.top = @elem.offset().top - $(document).scrollTop()
      @position.bottom = $(window).innerHeight() - ( @elem.offset().top - $(document).scrollTop() + @elem.outerHeight() )
      @position.reachedBottom = (@elem.parent().offset().top + @elem.parent().innerHeight()) <= (@elem.offset().top + @elem.outerHeight()) 
      @topPossible = !($(window).innerHeight() < @elem.outerHeight() + @offsetTop)
      #console.log @position
      #console.log @state
    stickTop: ->
      @state = "top"
      #console.log "stickTop"
      @elem.css {
        position: "fixed"
        top: @offsetTop
        bottom: "auto"
        width: "#{@width}px"
      }

    stick: ->
      @state = "bottom"
      #console.log "stick"
      @elem.css {
        position: "fixed"
        bottom: "#{@offsetBottom}px"
        marginBottom: 0
        top: "auto"
        width: "#{@width}px"
      }

    checkHeight: ->
      if @state == 'disable'
        return

      if @position.bottom <= @offsetBottom and @state != "bottom" 
        do @stick
      else if @position.reachedBottom and @state != "finish"
        do @finish
      else if @position.top >= @offsetTop and @state != "top" and @state == "finish"
        do @stickTop
      else if @position.top <= @offsetTop and @state != "top" and @state != "finish" and @topPossible
        do @stickTop
      else if !@topPossible and @position.bottom >= @offsetBottom and @state != "bottom" and @state != "finish"
        do @stick
      if @elem.parent().offset().top - @elem.offset().top > 0 and @state != "none"
        do @unstick
      


      

    unstick: ->
      @state = "none"
      #console.log "unstick"
      @elem.removeAttr("style")
      @elem.css width: "#{@width}px"

    finish: ->
      @state = "finish"
      #console.log "finish"
      @elem.css {
        position: "absolute"
        bottom: "#{@offsetBottom}px"
        marginBottom: 0
        top: "auto"
        width: "#{@width}px"
      }