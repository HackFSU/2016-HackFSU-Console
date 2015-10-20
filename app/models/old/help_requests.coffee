###
Model for Parse class 'HelpRequests'

Class specific vars:
	String      name
	String      location
	String      description
	Boolean     hidden
	String      hiddenBy

Use:
		1. TBD

###
CLASS_NAME = 'HelpRequests'

module.exports = (app) ->
	class app.models.HelpRequests
		constructor: (obj) ->
			@obj = obj

			# Validate object items
			@obj =
				name:           if obj.name? then obj.name else null
				location:       if obj.location? then obj.location else null
				description:    if obj.description? then obj.description else null
				hidden:         if obj.hidden? then obj.hidden else null
				hiddenBy:       if obj.hiddenBy? then obj.hiddenBy else null

		# Create new object in Parse
		createNew: () ->
			deferred = app.Q.defer()

			app.kaiseki.createObject CLASS_NAME, @obj,
				(err, res, body, success) ->
					if err
						console.log "PARSE: 'HelpRequests' object creation error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: 'HelpRequests' object creation error!"
						deferred.reject()
					else
						console.log "PARSE: 'HelpRequests' object created!"
						deferred.resolve()

			deferred.promise

		@getAll: () ->
			deferred = app.Q.defer()

			params =
				limit: 500

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

		@hide: (objectId, hiddenBy) ->
			deferred = app.Q.defer()

			data =
				hidden: true
				hiddenBy: hiddenBy

			app.kaiseki.updateObject CLASS_NAME, objectId, data,
				(err,res,body,success)->
					if err
						console.log "PARSE: '"+CLASS_NAME+"' hide error!"
						deferred.reject(err)
					else if !success
						console.log "PARSE: '"+CLASS_NAME+"' hide failure!"
						deferred.reject()
					else
						# console.log "PARSE: '"+CLASS_NAME+"' approve success!"

						deferred.resolve()

			return deferred.promise
