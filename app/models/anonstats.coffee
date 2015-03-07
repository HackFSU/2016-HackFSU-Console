###
Model for Parse class 'AnonStats'

Class Specific vars:
	String 		statName
	String 		statValue
###


CLASS_NAME = 'AnonStats'

module.exports = (app) ->
	class app.models.AnonStats
		constructor: (obj)->
			@obj = 
				gender: 		if obj.gender?	then obj.gender else null
				bday: 		if obj.bday?	then obj.bday else null
				
		# Pulls all records
		create: ()=>
			deferred = app.Q.defer()
			
			if (@obj.bday != null) || (@obj.gender != null)
				# there is data to save, save it
				
				data =
					birthdate: @obj.bday
					gender: @obj.gender			
				
				#get all current ids
				CLOUD_FUNCTION = 'createAnonStats'
				app.kaiseki.cloudRun CLOUD_FUNCTION, data,
					(err,res,body,success)->
						if err
							console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun error!"
							deferred.reject(err)
						else if !success
							console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun failure!"
							deferred.reject()
						else
							# console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun success!"
							deferred.resolve(true)
			else
				deferred.resolve(false)
				
			return deferred.promise
		
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
						
						deferred.resolve(body)
			
			return deferred.promise 
