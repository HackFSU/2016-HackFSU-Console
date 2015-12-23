/**
* Middleware functions for dashboard routes
*
* May need to eventually modularize this into a folder with individual middleware
* files when more stuff gets added.
*/

'use strict';

import _ from 'lodash';
import Hacker from '../../models/Hacker';

/**
* This function returns a formatted array of JSON objects each containing a unique
* school found through the Hacker table on Parse. The format is as follows:
* 	[
*			{
*				school: 'Example State University',
*				count: 43
*			}
*		]
* Count is the number of registered Hackers from a school.
*
* TODO: We will eventually need a normalization function to ensure abbreviations,
* misspellings, etc are accoutned for.
*/
export function getSchools(req, res, next) {

}
