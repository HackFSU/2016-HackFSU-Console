/**
* Takes an email template created by MailChimp, grabs the content from Mandrill,
* inserts any dynamic content, and sends the email to the specified list of
* recipients (via Mandrill).
*/

'use strict';

import mandrill from 'mandrill-api/mandrill';

/**
* @param app 	Global app object
* @param email	Email object containing the template configuration and data
*				email = {
*					template,
*					content,
*					message,
*					async=false,
*					ip_pool='Main Pool'
*				}
*/
export default function (app, email) {
	let client = new mandrill.Mandrill(process.env.MANDRILL_KEY);

	client.messages.sendTemplate({
		"template_name": email.template, "template_content": email.content,
		"message": email.message, "async": email.async, "ip_pool": email.ip_pool
	}, function(res) {
	    console.log(res);
	}, function(e) {
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	});
}
