###
Model for Parse class 'Mentors'

Class Specific vars:
	String 		firstName
	String 		lastName
	String 		email
	Number 		phoneNumber 	(10 digits)
	String 		affiliation
	String 		skills
	Boolean[5] 	times 			(in order of that on form)

Use:
	1. Import model
	2. Create new object (if isNew, creates object in parse)
	

###
CLASS_NAME = 'Mentors'

module.exports = (app) ->
	class app.models.Mentors		
		constructor: (obj)->
			@obj = obj
			
			#Store object correctly
			@obj = 
				firstName: 		if obj.firstName? then obj.firstName else null
				lastName: 		if obj.lastName? then obj.lastName else null
				email: 			if obj.email? then obj.email else null
				affiliation:	if obj.affiliation? then obj.affiliation else null
				skills:			if obj.skills? then obj.skills else null
				phoneNumber:	if obj.phoneNumber? then parseInt obj.phoneNumber else null
				times:			if obj.times? then obj.times else new Array()
			
			# console.log 'OBJ= ' + JSON.stringify @obj, undefined, 2
			#make sure times has 5
			if @obj.times.length != 5
				@obj.times = [
					if @obj.times[0]? then @obj.times[0] else false,
					if @obj.times[1]? then @obj.times[1] else false,
					if @obj.times[2]? then @obj.times[2] else false,
					if @obj.times[3]? then @obj.times[3] else false,
					if @obj.times[4]? then @obj.times[4] else false
				]
			
		# Creates a new parse object from this instance
		createNew: ()=>
			deferred = app.Q.defer()			
			
			app.kaiseki.createObject CLASS_NAME, @obj,
				(err,res,body,success)->
					if err
						console.log "PARSE: 'Mentors' Object creation error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: 'Mentors' Object creation failure!"
						deferred.reject()
					else
						console.log "PARSE: 'Mentors' Object created!"
						deferred.resolve()
			
			deferred.promise 
		
		# returns mentorData obj or null if not found
		@getByEmail: (email)->
			deferred = app.Q.defer()			
			
			params =
				limit: 1000
				where:
					email: email
			
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
						
						if body.length == 0
							deferred.resolve null
						else
							console.log "MENTOR LOGIN!"
							deferred.resolve 
								phoneNumber: body[0].phoneNumber
								affiliation: body[0].affiliation
								skills: body[0].skills
								times: body[0].times
									
			return deferred.promise 