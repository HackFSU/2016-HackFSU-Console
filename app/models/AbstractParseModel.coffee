##
# Abstact Parse model class
# - Do not make instances of this class
##

module.exports = (app)->
	class app.models.AbstractParseModel
		
		# Model & Parse class name
		@NAME: ''
		
		# Parse.Object instance
		pObj: null		
		
		# Get/set generators
		get = (props) =>
			@::__defineGetter__ name, func for name, func of props
		set = (props) =>
			@::__defineSetter__ name, func for name, func of props
		
		# For creating a model instance
		constructor: (objData)->
			if !@constructor.NAME
				throw new Error 'Parse Class must have a name'
			
			console.log 'name=' +  @constructor.NAME
			console.log @constructor
			
			parseSubclass = app.Parse.Object.extend @constructor.NAME
			@pObj = new parseSubclass()
			console.log @pObj
			
			
		
		# For saving an instance to parse
		save: ()->
			return @pObj.save()
		
		destroy: ()->
			return @pObj.destroy()
		
		unset: (prop)->
			@pObj.unset prop
			return
		
		# Returns a single model instance or null
		@findById: ()->
		
		# Returns an array
		@findByCreatedAt: (start, end)->
			