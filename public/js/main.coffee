###
Contains global js

Dependencies:
	jQuery

###


###
jQuery Plugin: fixTextToSingleLine(maxSize, minSize)
Dynamically resizes text to fit one line.
Sizes are in pixels
###
( ($) -> 
	doms = new Array() 	#contains attached dom elements
	shiftAmt = .5 			#amount in px per change
	# Actual plugin function
	$.fn.fixTextToSingleLine = (maxSize, minSize) ->
		doms.push 
			$: this
			max: maxSize
			min: minSize
			pwidth: this.parent().width() #width snapshot
			
		return this
		
	# Runs check on attatched dom elements
	runCheck = () ->
		for dom in doms
			pwidth = dom.$.parent().width() #current parent width
			fsize = parseFloat(dom.$.css('font-size')) #current font size
						
			if dom.pwidth > pwidth
				#has shrunk, shink text if possible
				while fsize > dom.min and (dom.$.height() - fsize > 5) 
					fsize -= shiftAmt
					dom.$.css('font-size', fsize)
			else
				#has grown, grow text if possible
				while fsize < dom.max and (dom.$.height() - fsize < 5) 
					fsize += shiftAmt
					dom.$.css('font-size', fsize)
				#undo last
				dom.$.css('font-size', fsize - shiftAmt)
			
			#check min/max
			fsize = parseFloat(dom.$.css('font-size'))
			if(fsize > dom.max)
				dom.$.css('font-size', dom.max)
			else if(fsize < dom.min)
				dom.$.css('font-size', dom.min)
				
			#restore pwidth
			dom.pwidth = pwidth
				
	$(document).ready () ->
		setTimeout ()->
			runCheck()
		, 10
		
	$(window).resize () ->
		runCheck()
	return
		
) jQuery

#########################################################

###
jQuery plugin: shakeIt (Matt's shake thing)
shake it sh-sh-shake it
###

( ($) -> 
	$.fn.shakeIt = () ->
		theShakenOne = this
		theShakenOne.addClass('shakeText')
		theShakenOne.one 'webkitAnimationEnd oanimationend msAnimationEnd animationend', (e) ->
			theShakenOne.removeClass('shakeText')
		return this
) jQuery

#########################################################



$('.singleLineText').fixTextToSingleLine(68.8,35.2)