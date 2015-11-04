###
Model for Parse class 'Schedule'

Class Specific vars:
	String 		title
	String 		subtitle
	Date 			startTime
	Date 			endTime

###
CLASS_NAME = 'Schedule'

module.exports = (app) ->
	class app.models.Schedule
		constructor: (obj)->
		
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
						# console.log "PARSE: '"+CLASS_NAME+"' getAll success!"+
						# 				" Got " + body.length
						
						if body.length > 0
							deferred.resolve(body)
						else
							deferred.reject()
			
			return deferred.promise 
