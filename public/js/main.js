/*
Contains global js

Dependencies:
	jQuery
 */
(function($) {
	'use strict';

	/*
	jQuery Plugin: fixTextToSingleLine(maxSize, minSize)
	Dynamically resizes text to fit one line.
	Sizes are in pixels
	 */

	var doms, runCheck, shiftAmt;
	doms = [];
	shiftAmt = 0.5;
	$.fn.fixTextToSingleLine = function(maxSize, minSize) {
		doms.push({
			$: this,
			max: maxSize,
			min: minSize,
			pwidth: this.parent().width()
		});
		return this;
	};
	runCheck = function() {
		var dom, fsize, i, len, pwidth, results;
		results = [];
		for (i = 0, len = doms.length; i < len; i++) {
			dom = doms[i];
			pwidth = dom.$.parent().width();
			fsize = parseFloat(dom.$.css('font-size'));
			if (dom.pwidth > pwidth) {
				while (fsize > dom.min && dom.$.height() - fsize > 5) {
					fsize -= shiftAmt;
					dom.$.css('font-size', fsize);
				}
			} else {
				while (fsize < dom.max && dom.$.height() - fsize < 5) {
					fsize += shiftAmt;
					dom.$.css('font-size', fsize);
				}
				dom.$.css('font-size', fsize - shiftAmt);
			}
			fsize = parseFloat(dom.$.css('font-size'));
			if (fsize > dom.max) {
				dom.$.css('font-size', dom.max);
			} else if (fsize < dom.min) {
				dom.$.css('font-size', dom.min);
			}
			results.push(dom.pwidth = pwidth);
		}
		return results;
	};
	$(document).ready(function() {
		return setTimeout(function() {
			return runCheck();
		}, 10);
	});
	$(window).resize(function() {
		return runCheck();
	});


	/**
	 * jQuery plugin: shakeIt (Matt's shake thing)
	 * shake it sh-sh-shake it
	 */
	$.fn.shakeIt = function() {
		var theShakenOne;
		theShakenOne = this;
		theShakenOne.addClass('shakeText');
		theShakenOne.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
			return theShakenOne.removeClass('shakeText');
		});
		return this;
	};
	$('.singleLineText').fixTextToSingleLine(68.8, 35.2);


	$(function() {
		$('#logo').click(function() {
			window.location = '/';
		});
	});

})(jQuery);
