###
Model for Parse class 'Applications'

Class Specific vars:
	String 		firstName
	String 		lastName
	String 		email
	String		school
	String 		major
	String		year = ['Freshman', 'Sophomore','High School Student', 'Junior', 'Senior', 'Graduate Student']
	String		github
	Array			QAs = 
					[
						Boolean 	=> First hackathon?
						String 	=>	One thing you hate about hackthons?
						Boolean Array => Things you want to learn?
						[
								iOS, Android, Web, Front-end, Back-End,  off the shelf hardware, micros
						]	
						String => Dietary restriction
						String => Comments
					]
	String 		status = 'denied' 'waitlisted' 'accepted' 'going' 'not going' 'pending'
Use:
	1. Import model
	2. Create new object (if isNew, creates object in parse)
	

###




CLASS_NAME = 'Applications'

module.exports = (app) ->
	class app.models.Applications
		constructor: (obj)->
			obj = if obj? then obj else {}

			#Store object correctly
			@obj = 
				firstName: 		if obj.firstName? then obj.firstName else null
				lastName: 		if obj.lastName? then obj.lastName else null
				email: 			if obj.email? then obj.email else null
				school:			if obj.school? then obj.school else null
				major:			if obj.major? then obj.major else null
				year:				if obj.year? then obj.year else null
				github:			if obj.github? then obj.github else null
				QAs:				if obj.QAs? then obj.QAs else new Array()
				status:			'Pending'
			
			#fill in QAs
			if @obj.QAs.length != 5
				@obj.QAs = [
					if @obj.QAs[0]? then @obj.QAs[0] else null
					if @obj.QAs[1]? then @obj.QAs[1] else null
					if @obj.QAs[2]? then @obj.QAs[2] else new Array()
					if @obj.QAs[3]? then @obj.QAs[3] else null
					if @obj.QAs[4]? then @obj.QAs[4] else null
				]
			if @obj.QAs[2].length != 7
				for i in [0..7]
					if !@obj.QAs[2][i]? then @obj.QAs[2][i] = false
					
		# Pulls all records
		@getAllApps: ()->
			deferred = app.Q.defer()			
			
			params =
				limit: 1000
			
			app.kaiseki.getObjects CLASS_NAME, params,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' Object getAll error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' Object getAll failure!"
						deferred.reject()
					else
						console.log "PARSE: '"+CLASS_NAME+"' Object getAll success!"+
										" Got " + body.length
						
						deferred.resolve(body)
			
			return deferred.promise 

		# Generates and returns a 60 unique charcter randomized string (checks it)
		@generateNewConfirmationId: ()->
			deferred = app.Q.defer()
			data =
				limit: 1000
			
			
			#get all current ids
			CLOUD_FUNCTION = 'getAllConfirmationIds'
			app.kaiseki.cloudRun CLOUD_FUNCTION, data,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun failure!"
						deferred.reject()
					else
						# console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun success!"+
										" Got " + body.result.length
						
						#generate new key
						unique = false
						key = ''
						while !unique
							unique = true
							key = app.uuid.v4()
							for k in body.result when unique
								if k == key
									unique = false
						
						deferred.resolve(key)
			
			return deferred.promise
		
		### Parse CC function
			Grabs just enough data from the app with the objectId to send an email
			if valid, result = 
				firstName: (string)
				lastName: (string)
				email: (string)
				status: (string)
			else result = null
				
		###
		@getAppSimpleByObjectId: (objectId)->
			deferred = app.Q.defer()			
			
			data = 
				objectId: objectId
			
			CLOUD_FUNCTION = 'getAppSimpleByObjectId'
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
						
						deferred.resolve(body.result)
			
			return deferred.promise
		
		### Parse CC function
			Checks if a confirmation id is valid.
			if it is, result = 
				valid: true
				objectId: (string)
				firstName: (string)
				lastName: (string)
				hasDiet: (boolean)		#if we have data on their diet question
			if it isnt, result =
				valid: false
		### 
		@getAppSimpleByConfirmationId: (confirmationId) ->
			deferred = app.Q.defer()			
			
			data = 
				confirmationId: confirmationId
			
			CLOUD_FUNCTION = 'getAppSimpleByConfirmationId'
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
						
						deferred.resolve(body.result)
			
			return deferred.promise
		
		#Simply counts all status typs and returns them (See Parse CC Funct)
		@getAppStatusCounts: () ->
			deferred = app.Q.defer()			
			
			CLOUD_FUNCTION = 'getAppStatusCounts'
			app.kaiseki.cloudRun CLOUD_FUNCTION, null,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun failure!"
						deferred.reject()
					else
						# console.log "PARSE: '"+CLOUD_FUNCTION+"' CloudRun success!"
						
						deferred.resolve(body.result)
			
			return deferred.promise
		
		# Sets the application as approved and assigns it a confirmationId.
		# Returns confirmationId
		@accept: (objectId) ->
			deferred = app.Q.defer()			
			
			p = app.models.Applications.generateNewConfirmationId()
			p.then (confirmationId)-> #resolve
				console.log 'PARSE: confirmationId ' + confirmationId + ' created'
				
				data =
					status: 'accepted'
					confirmationId: confirmationId
				
				app.kaiseki.updateObject CLASS_NAME, objectId, data,
					(err,res,body,success)->
						if err
							console.log "PARSE: '"+CLASS_NAME+"' approve error!"
							deferred.reject(err)
						else if !success
							console.log "PARSE: '"+CLASS_NAME+"' approve failure!"
							deferred.reject()
						else
							# console.log "PARSE: '"+CLASS_NAME+"' approve success!"							
							
							deferred.resolve(confirmationId)
				
			, (err)-> #reject
				console.log 'PARSE: confirmationId creation failed.'
				deferred.reject(err)

			return deferred.promise
		
		@waitlist: (objectId) ->
			deferred = app.Q.defer()			
			
			data =
				status: 'waitlisted'
			
			app.kaiseki.updateObject CLASS_NAME, objectId, data,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' approve error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' approve failure!"
						deferred.reject()
					else
						# console.log "PARSE: '"+CLASS_NAME+"' approve success!"							
						
						deferred.resolve()
				
			return deferred.promise
			
		
		@confirmSave: (confirmData)->
			deferred = app.Q.defer()
			
			params = 
				limit: 1
				where:
					confirmationId: confirmData.confirmationId
			
			#get application
			app.kaiseki.getObjects CLASS_NAME, params,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' getObjects error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' getObjects failure!"
						deferred.reject()
					else
						# console.log "PARSE: '"+CLASS_NAME+"' getObjects success!"							
						
						# update with new data
						data = 
							status:				if confirmData.going then 'going' else 'not going'
							phoneNumber:		parseInt("" + confirmData.phoneNumber)
							tshirt: 				confirmData.tshirt
							confirmQAs:
								emergencyContact: parseInt("" + confirmData.emergencyContact)
								agreement: 		confirmData.agreement
								specialNeeds: 	confirmData.specialNeeds
								diet: 			confirmData.diet
								comments: 		confirmData.comments
								under18:			confirmData.under18
						
						# console.log 'Confirming... ' + JSON.stringify data, undefined, 2
						console.log 'Confirming... ' + body[0].email + ' with ' + data.status
							
						app.kaiseki.updateObject CLASS_NAME, body[0].objectId, data,
							(err,res,body2,success)->
								if err
									console.log "PARSE: '"+CLASS_NAME+"' confirmSave error!"
									deferred.reject(err)
								else if !success
									console.log "PARSE: '"+CLASS_NAME+"' confirmSave failure! " + 
										JSON.stringify body2, undefined, 2
									deferred.reject()
								else if !body2.updatedAt?
									console.log "PARSE: '"+CLASS_NAME+"' confirmSave none updated!"
									deferred.reject()
								else
									# console.log "PARSE: '"+CLASS_NAME+"' confirmSave success! "+
									# 	"Object: " + body[0].objectId + "UpdatedAt: " + body2.updatedAt							
									
									
									#save anon stats
									as = new app.models.AnonStats
										bday: confirmData.bday
										gender: confirmData.gender
									p = as.create()
									p.then ()-> #resolve
										deferred.resolve()
									, ()-> #reject
										deferred.reject()
			
			return deferred.promise