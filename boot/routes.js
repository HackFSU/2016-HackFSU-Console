/**
 * Map routes to controllers
 */

'use strict';

import bodyParser from 'body-parser';


export default function setRoutes(app) {
	const e = app.e;
	const c = app.controller;

	// Parsers
	const jsonParser = bodyParser.json();
	// const urlencodeParser = bodyParser.urlencoded({
	// 	extended: false
	// });
	
	let useAcl = {
		User: app.acl.useAcl('User'),
		Hacker: app.acl.useAcl('Hacker'),
		Mentor: app.acl.useAcl('Mentor'),
		Admin: app.acl.useAcl('Admin'),
		SuperAdmin: app.acl.useAcl('SuperAdmin')
	};


	/**************************************************************************
	 * Public
	 * - ignores ACL
	 */

	e.get('/', c.Index.index);
	e.get('/index', c.Index.index);
	e.get('/home', c.Index.index);

	// Preview Page
	// e.post('/preview/subscribe', jsonParser, c.Preview.subscribe);

	e.get('/register', c.Registration.form);

	/**************************************************************************
	 * User
	 */
	e.get('/user/login', c.User.login);
	e.get('/user/profile', useAcl.User, c.User.profile);


	/**************************************************************************
	 * Hacker
	 */

	/**************************************************************************
	 * Mentor
	 */

	/**************************************************************************
	 * Admin
	 */
	e.get('/admin/emails', useAcl.Admin, c.admin.Emails.index);
	e.get('/admin/emails/new', useAcl.Admin, c.admin.Emails.new);
	e.post('/admin/emails/create', useAcl.Admin, jsonParser, c.admin.Emails.create);

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
			message: 'Page "' + req.originalUrl + '" not found'
		});
	});
}
