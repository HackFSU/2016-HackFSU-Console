/**
* Middleware functions for dashboard routes
*
* May need to eventually modularize this into a folder with individual middleware
* files when more stuff gets added.
*/

'use strict';

import _ from 'lodash';
import Hacker from 'app/models/Hacker';

/**
* This function returns a formatted array of JSON objects each containing a unique
* school found through the Hacker table on Parse. The format is as follows:
* 	[
*			{
*				school: 'Example State University',
*				count: 42
*			}
*		]
* Count is the number of registered Hackers from a school.
*
* TODO: We will eventually need a normalization function to ensure abbreviations,
* misspellings, etc are accoutned for.
*/
export function getSchools(req, res, next) {
	Hacker.getSchools().then(function(schools) {
		// Don't send anything but the schools
		let schoolData = {};

		_.each(schools, function(school) {
			if (!_.has(schoolData, school.get('school'))) {
				_.set(schoolData, `${school.get('school')}.count`, 1);
				_.set(schoolData, `${school.get('school')}.students`, [{ name: school.get('user').get('firstName') + ' ' + school.get('user').get('lastName'), id: school.id }]);
			}
			else {
				_.set(schoolData, `${school.get('school')}.count`, _.get(schoolData, `${school.get('school')}.count`) + 1);
				schoolData[school.get('school')].students.push({ name: school.get('user').get('firstName') + ' ' + school.get('user').get('lastName'), id: school.id });
			}
		});

		req.log.info({ schools: schoolData }, 'List of Schools');
		req.schools = schoolData;
		next();
	},
	function(err) {
		req.log.warn({ err: err }, 'Error getting list of schools');
		res.json({
			err: err
		});
	});
}
