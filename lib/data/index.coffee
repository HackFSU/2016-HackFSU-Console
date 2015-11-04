##
# Load any static data and constants
##

# Base
exports.HOST_NAME = 'hackfsu.com'

# Email
exports.email =
	FROM_EMAIL_NOREPY: 'noreply@' + exports.HOST_NAME		# fake
	FROM_EMAIL_REGISTER: 'register@' + exports.HOST_NAME	# fake
	FROM_EMAIL_INFO: 'info@' + exports.HOST_NAME				# valid
	FROM_NAME: 'HackFSU'
	
# TODO
exports.schools = require './schools.json'
