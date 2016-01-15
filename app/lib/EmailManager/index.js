/**
 * EmailManager Class
 *
 *	For sending emails easily. There needs to be a corresponding template
 *	in the ./templates folder.
 * 
 * - All emailData will be in local scope of the jade templates.
 *
 * TODO
 * 	Mandrill error checking
 */

'use strict';

import Mandrill from 'mandrill-api/mandrill';
import path from 'path';
import _ from 'lodash';
import emailTemplates from 'email-templates';

var templateDir = path.resolve(__dirname, 'templates');
var mandrill = new Mandrill.Mandrill(process.env.MANDRILL_KEY);

class Render {
	constructor(eData) {
		this.eData = eData;
	}

	batch(batch) {
		batch(this.eData, templateDir, this._send);
	}

	_send(err, html, text) {
		if(err) {
			console.error('[emailTemplates] ' + err);
			return;
		}
		
		// Send via mandrill api
		mandrill.messages.send({
			async: true,
			message: {
				html: html,
				text: text,
				subject: this.eData.subject,
				from_email: this.eData.fromEmail,
				from_name: this.eData.fromName,
				to: {
					type: 'to',
					email: this.eData.toEmail,
					name: this.eData.toName
				}
			}
		}, (result) => {
			// Sending Success
			console.log('[mandrill] SUCCESS: sent subject="'+this.eData.subject+'" to "'+this.eData.toEmail+'"');
			
			if(_.isFunction(this.eData.success)){
				this.eData.success(this.eData, result);
			}

		}, (err) => {
			// Sending failure
			console.error('[mandrill] ERROR: unable to send subject="'+this.eData.subject+'" to "'+this.eData.toEmail+'"; ' + err);
		
			if(_.isFunction(this.eData.error)){
				this.eData.error(this.eData, err);
			}
		});
	}
}

export default class EmailManager {
	constructor(defaultFromEmail, defaultFromName) {
		this.defaults = {
			fromEmail: _.isString(defaultFromEmail)? defaultFromEmail : '',
			fromName: _.isString(defaultFromName)? defaultFromName : ''
		};
	}

	send(templateName, emailData) {
		var eData;

		if(!_.isString(templateName) ||
			!_.isObject(emailData) ||
			!_.isString(emailData.toEmail)) {
			throw 'Invalid params';
		}

		// Put in needed defaults
		eData = {};
		_.merge(eData, this.defaults, emailData);

		if(!_.isString(eData.toName)) {
			eData.toName = '';
			if(_.isString(eData.toFirstName)) {
				eData.toName += eData.toFirstName;
			}
			if(_.isString(eData.toLastName)) {
				if(_.trim(eData.toName)) {
					eData.toName += ' ';
				}
				eData.toName += eData.toLastName;
			}
			if(!_.trim(eData.toName)) {
				// Just use the email username
				eData.toName += this.eData.toEmail.substring(0,
					this.eData.indexOf('@'));
			}
		}


		emailTemplates(templateDir, (err, template) => {
			if(err) {
				console.error('[emailTemplates] ' + err);
				return;
			}

			// Render batch
			template(templateName, true, (err, batch) => {
				if(err) {
					console.error('[emailTemplates] ' + err);
					return;
				}

				var render = new Render(eData);
				render.batch(batch);
			});
		});

		
	}
}

