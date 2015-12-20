/**
 * Map routes to controllers
 */

'use strict';

//import bodyParser from 'body-parser';
import expressValidator from 'express-validator';


export default function setRoutes(app) {
	const e = app.e;
	const c = app.controller;

	// Parsers
	const jsonParser = app.bodyParser.json();
	const urlencodeParser = app.bodyParser.urlencoded({
		limit: '2mb',
		extended: false
	});

	let useAcl = {
		User: app.acl.useAcl('User'),
		Hacker: app.acl.useAcl('Hacker'),
		Mentor: app.acl.useAcl('Mentor'),
		Admin: app.acl.useAcl('Admin'),
		SuperAdmin: app.acl.useAcl('SuperAdmin')
	};

	// Home
	e.get('/', c.Index.index);
	//e.get('/index', c.Index.index);
	//e.get('/home', c.Index.index);
	//e.get('/', c.Preview.index);
	// Preview Page
	 e.post('/preview/subscribe', jsonParser, c.Preview.subscribe);

	// Registration pages
	e.get('/register', c.Registration.index);
	e.get('/apply', (req, res) => { res.redirect('/register'); });
	e.post('/register/submit', urlencodeParser, c.Registration.submit);

	// User pages
	e.get('/user/login', c.User.login);
	e.get('/user/profile', useAcl.User, c.User.profile);

	// Admin/email pages
	e.get('/admin/emails', useAcl.Admin, c.admin.Emails.index);
	e.get('/admin/emails/new', useAcl.Admin, c.admin.Emails.new);
	e.post('/admin/emails/create', useAcl.Admin, c.admin.Emails.create);

	// Catch page not found - 404
	e.get('*', function(req, res) {
		res.status(404);
		res.render('public/error', {
			title: 404,
			code: 404,
			message: 'Page "' + req.originalUrl + '" not found'
		});
	});
}
