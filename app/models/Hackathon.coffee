##
# Governing Hackathon objects. Allows for control over the current 
# hackathon instance and the ability to move onto new ones.
# 
# WARNING:
# 	- Not all data is hackathon-specific, and will be reset upon switching
# 	- Do not create the next hackathon unless you know what you are doing
# 	- current == latest, and requires a server reboot to change
## 

module.exports = (app)->
	class app.models.Hackathon extends app.models.AbstractParseModel
		
		@NAME: 'Hackathon'
		
		constructor: (objData)->
			
			# Error checking only
			
			super objData
		
		