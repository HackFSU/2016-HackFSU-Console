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
Use:
	1. Import model
	2. Create new object (if isNew, creates object in parse)
	

###


Q = require 'q' #for async
CLASS_NAME = 'Applications'

module.exports =
	class Applications		
		constructor: (kaiseki, obj)->
			@kaiseki = kaiseki
			@obj = obj
			
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
		@getAllApps: (kaiseki)=>
			deferred = Q.defer()			
			
			params =
				limit: 1000
			
			kaiseki.getObjects CLASS_NAME, params,
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
			
			deferred.promise 
		
		