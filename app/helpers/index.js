/**
 * App-wide helper functions
 */
'use strict';

// Returns a string of words indicating how long ago something was
export function timeAgo(time) {
	let millis = Date.parse(time);
	let daysAgo = (Date.now() - millis) / 1000 / 60 / 60 / 24;

	if (daysAgo >= 1) {
		let ago = daysAgo >= 2 ? 'days ago' : 'day ago';
		return `${Math.floor(daysAgo)} ${ago}`;
    }

	let hoursAgo = daysAgo * 24;

	if (hoursAgo >= 1) {
		let ago = hoursAgo >= 2 ? 'hours ago' : 'hour ago';
		return  `${Math.floor(hoursAgo)} ${ago}`;
    }

	let minsAgo = hoursAgo * 60;

	if (minsAgo >= 1) {
		let ago = minsAgo >= 2 ? 'minutes ago' : 'minute ago';
		return `${Math.floor(minsAgo)} ${ago}`;
    }

	let secsAgo = minsAgo * 60;
	let ago = secsAgo >= 2 ? 'seconds ago' : 'second ago';

	return `${Math.floor(secsAgo)} ${ago}`;
}
