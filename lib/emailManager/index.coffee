##
# Everything regarding sending emails
# Service: Mandrill
# 
# REQUIREMENTS ###########################
# app.env
# app.env.MANDRILL_KEY
# app.Q
# app.util
# 
# API ####################################
# emailManager
# 		send(templateName, emailData) -- send an email
##

Mandrill = require 'mandrill-api/mandrill'	# email sending
emailTemplates = require 'email-templates'	# email creation

module.exports = (app)->
	em = {}
	
	em._templateDir = app.path.resolve __dirname, 'templates'
	em._maindrill = new Mandrill.Mandrill app.env.MANDRILL_KEY
	
	# Generic email renderer
	em._Render = (locals)->
		self = this
		self.send = (err, html, text)->
			if err
				console.log ' > Email-templates - Error: ' + err
				dfd.reject err
				return
			
			# Get most correct name
			toName = ''
			if locals.toFirstName
				toName += locals.toFirstName
			if locals.toLastName
				if toName
					toName += ' '
				toName += locals.toLastName
			if !toName
				# Just use the email username
				toName = locals.toEmail.substring 0, locals.indexOf '@'
			
			# Send via mandrill api
			em._maindrill.messages.send 
				async: true
				message: 
					html: html
					text: text
					subject: locals.subject
					from_email: locals.fromEmail || app.data.email.FROM_EMAIL_INFO
					from_name: locals.fromName || app.data.email.FROM_EMAIL_NAME
					to: [
						type: 'to'
						email: locals.toEmail
						name: toName 
					]
			, (result)->
				console.log ' > Maindril - sent success - subject="' + locals.subject + '" toEmail="' + locals.toEmail + '"'
				
				if app.util.isFunction locals.success
					locals.success locals
					
			, (err)->		
				console.log ' > Maindril - sent error - subject="' + locals.subject + '" toEmail="' + locals.toEmail + '"'
				console.log err
				if app.util.isFunction locals.error
					locals.error locals, err
				
		self.batch = (batch)->
			batch locals, em._templateDir, self.send
	
		return
		
	###
		Send an email. The emailData object is loaded into the template scope, 
		allowing direct access to email data in the jade.
		
		Usage:
		@param templateName = name of template directory (string)
		@param emailData =
			subject						[string, required]
			toEmail						[string, required]
			fromEmail 					[string]
			fromName 					[string]
			toFirstName 				[string]
			toLastName 					[string]
			success(emailData)		[cb, mandrill send success]
			error(emailData, err)	[cb, mandrill send failure]
			...							[..., any aditional template vars]
	###
	em.send = (templateName, emailData)->
		# Check usage
		if !templateName? ||
		!emailData? ||
		!emailData.subject? ||
		!emailData.toEmail?
			console.log '> emailTemplates - Invalid usage'
			return
		
		# Render & Send
		emailTemplates em._templateDir, (err, template)->
			if err
				console.log '> emailTemplates error ' + err
				return
				
			# Render the batch (just a single email really)
			template templateName, true, (err, batch)->
				if err
					console.log ' > emailTemplates error ' + err
					return
				
				render = new em._Render emailData
				render.batch batch
	
	
	return em