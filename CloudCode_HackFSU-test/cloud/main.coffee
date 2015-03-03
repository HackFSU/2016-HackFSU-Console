### 
	Parse Cloud code for HackFSU-test
	
	To update, follow this: https://www.parse.com/docs/cloud_code_guide#started
	Must be manually converted into .js
	global.json is required (gitignored, see Jared)

EXAMPLE:

Parse.Cloud.define "hello", (req, res)->
  res.success "Hello world!"

###

#returns an array of all confirmation ids
Parse.Cloud.define "getAllConfirmationIds", (req,res)->
	Parse.Cloud.useMasterKey()
	
	# Applications = new Parse.Object.extend 'Applications'
	query = new Parse.Query 'Applications'
	query.limit 1000
	query.find
		success: (results)->
			ids = []
			
			for app in results
				if (app.get 'confirmationId')?
					ids.push app.get 'confirmationId'
			
			res.success ids
			return
		error: (error)->
			res.error error
			return
	return

###
	Checks if a confirmation id is valid.
	if it is, result = 
		valid: true
		objectId: (string)
		firstName: (string)
		lastName: (string)
		hasDiet: (boolean)		#if we have data on their diet question
		status: (string)
	if it isnt, result =
		valid: false
### 
Parse.Cloud.define "getAppSimpleByConfirmationId", (req,res)->
	Parse.Cloud.useMasterKey()
	
	# Applications = new Parse.Object.extend 'Applications'
	query = new Parse.Query 'Applications'
	query.equalTo 'confirmationId', req.params.confirmationId
	query.limit 1
	query.find
		success: (results)->
			if results.length == 0
				res.success 
					valid: false
			else
				res.success 
					valid: true
					objectId: results[0].get 'objectId'
					firstName: results[0].get 'firstName'
					lastName: results[0].get 'lastName'
					hasDiet: (results[0].get 'QAs')[3].trim()?
					status: results[0].get 'status'
			return
		error: (error)->
			res.error error
			return
	return