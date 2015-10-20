###
Model for Parse class 'Updates'

Class Specific vars:
	String 		title
	String 		subtitle

Others:
	Date 			createdAt

###
CLASS_NAME = 'Updates'
PUSH_CHANNEL = 'updates'

module.exports = (app) ->
	class app.models.Updates
		constructor: (obj)->
			@obj = obj
			
			#Store object correctly
			@obj = 
				title: 		if obj.title? then obj.title else null
				subtitle: 	if obj.subtitle? then obj.subtitle else null
			
			
		# Creates a new parse object from this instance
		createNew: ()=>
			deferred = app.Q.defer()			
			
			if @obj.title != null && @obj.subtitle != null
				app.kaiseki.createObject CLASS_NAME, @obj,
					(err,res,body,success)->
						if err
							console.log "PARSE: '"+CLASS_NAME+"' Object creation error!"
							deferred.reject(err)
						else if !success
							console.log "PARSE: '"+CLASS_NAME+"' Object creation failure!"
							deferred.reject()
						else
							console.log "PARSE: '"+CLASS_NAME+"' Object created!"
							deferred.resolve()
			
			deferred.promise 
		
		# Sends push notification with the given title
		@sendPush: (title,subtitle)=>
			deferred = app.Q.defer()
			
			notification = 
				channels: [PUSH_CHANNEL]
				data:
					alert: title
					info: subtitle
			
			app.kaiseki.sendPushNotification notification, 
				(err, res, body, success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' push error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' push failure!"
						deferred.reject()
					else
						console.log "PARSE: '"+CLASS_NAME+"' push success!"
						deferred.resolve()
									
			deferred.promise
		
		
		# Pulls all records
		@getAll: ()->
			deferred = app.Q.defer()			
			
			params =
				limit: 1000
			
			app.kaiseki.getObjects CLASS_NAME, params,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' getAll error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' getAll failure!"
						deferred.reject()
					else
						console.log "PARSE: '"+CLASS_NAME+"' getAll success!"+
										" Got " + body.length
						
						deferred.resolve(body)
			
			return deferred.promise 
