###
Model for Parse class 'Users'

Class Specific vars:
	String 		firstName
	String 		lastName
	String 		email
	String 		username (=email)
	Boolean 		isAdmin

###
CLASS_NAME = 'User'
module.exports = (app) ->
	class app.models.User		
		constructor: (usr)->
			@usr = usr
			@valid = true
			
			#Store usrect correctly
			@usr = 
				firstName: 		if usr.firstName? then usr.firstName else null
				lastName: 		if usr.lastName? then usr.lastName else null
				email: 			if usr.email? then usr.email else null
				isAdmin:			if usr.isAdmin? then usr.isAdmin else false
				password:		if usr.password? then usr.password else 'passwordDefault123'
			
			if !@usr.email?
				@valid = false
			else
				@usr.username = @usr.email

		# Creates a new parse usrect from this instance
		createNew: ()=>
			deferred = app.Q.defer()			
			
			app.kaiseki.createUser @usr,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' creation error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' creation failure! " +
							JSON.stringify body
						deferred.reject()
					else
						console.log "PARSE: '"+CLASS_NAME+"' created!"
						deferred.resolve()
			
			deferred.promise 
		
