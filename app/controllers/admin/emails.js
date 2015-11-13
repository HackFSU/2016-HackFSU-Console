/**
* Public facing emails controller
*
* Email object containing the template configuration and data requires the following:
*	email = {
*		template,
*		content,
*		message,
*		async=false,
*		ip_pool='Main Pool'
*	}
*/
'use strict';

export default function(app) {
	app.controller.admin.Emails = {

		index: function(req, res) {
			let query = new app.Parse.Query(app.model.Email);
			query.find().then(function(emails) {
				console.log(emails.length);
				res.render('admin/emails/index', {
					title: 'Email Manager',
					emails: emails
				});
			});
		},

		new: function(req, res) {
			res.render('admin/emails/new', {
				title: 'Add New Email Template'
			});
		},

		create: function(req, res) {
			let email = new app.model.Email(req.body);
			email.save().then();
		}

		// example: function(req, res) {
		// 	let email = {
		// 		template: 'Test 1',
		// 		content: [{
		// 			"name": "custom",
		// 			"content": "<h2>HackFSU Test!<h2>"
		// 		}],
		// 		message: {
		// 			"html": "<p>Example HTML content</p>",
		// 			"text": "Example test content",
		// 			"subject": "This is a Mandrill Template Test",
		// 			"from_email": "testing@hackfsu.com",
		// 			"from_name": "HackFSU",
		// 			"to": [{
		// 					"email": "thelms501@gmail.com",
		// 					"name": "Trevor Helms",
		// 					"type": "to"
		// 				}],
		// 			"headers": {
		// 				"Reply-To": "dontfuckingreply@hackfsu.com"
		// 			},
		// 			"important": false
		// 		},
		// 		async: false,
		// 		ip_pool: "Main Pool"
		// 	};
		// }
	};
}
