/**
 * Map routes to controllers
 */

'use strict';

//import ACL from '../lib/acl';
import bodyParser from 'body-parser';


export default function setRoutes(app) {
	const e = app.e;
	const c = app.controller;
	// const dirs = app.dirs;

	// Parsers
	const jsonParser = bodyParser.json();
	// const urlencodeParser = bodyParser.urlencoded({
	// 	extended: false
	// });


	// // Setup ACL
	// const acl = app.acl = new ACL({
	// 	User:1,
	// 	Hacker:2,
	// 	Mentor:3,
	// 	Admin:4,
	// 	SuperAdmin:5
	// });
	// acl.setEnforce(true);
	// acl.setRoles();
    //
	// acl.mergeRole('Hacker', 'User');
	// acl.mergeRole('Mentor', 'User');
	// acl.mergeRole('Admin', 'User', 'Hacker', 'Mentor');
	// acl.mergeRole('SuperAdmin', 'Admin');
    //
	// /**
	//  * ACL middleware generator
	//  */
	// let useACL = function(validRoles) {
	// 	let aclKey = acl.genACL(validRoles);
	// 	return function(req, res, next) {
	// 		let roleId;
    //
	// 		if(req.sesssion.user) {
	// 			roleId = req.sesssion.user.roleId;
	// 		} else {
	// 			roleId = ACL.roles.Public;
	// 		}
    //
	// 		if(acl.check(roleId, aclKey)) {
	// 			// Passed ACL
	// 			next();
	// 			return;
	// 		}
	//
	// 		// Failed ACL
	// 		if(req.session.user) {
	// 			res.redirect('/profile?accessDenied=true');
	// 		} else {
	// 			res.redirect('/login?accessDenied=true');
	// 		}
	// 	};
	// };


	/**************************************************************************
	 * Public
	 * - ignores ACL
	 */

	//e.get('/', c.Preview.index);
	e.get('/', c.Index.index);
	e.get('/index', c.Preview.index);
	e.get('/home', c.Preview.index);

	e.post('/preview/subscribe', jsonParser, c.Preview.subscribe);

	/**************************************************************************
	 * User
	 */


	/**************************************************************************
	 * Hacker
	 */


	/**************************************************************************
	 * Mentor
	 */


	/**************************************************************************
	 * Admin
	 */


	/**************************************************************************
	 * SuperAdmin (dangerous/secret stuff)
	 */


	/**************************************************************************
	 * Special
	 */

	e.get('*', function(req, res) {
		res.status(404);
		res.render('public/error', {
			title: 404,
			code: 404,
			message: 'Page "'+req.originalUrl+'" not found'
		});
	});
}
