###
	Handles management of users for /admin/users

	Dependencies:
		parse-connection.js
		JQuery
	
	Parse Class:
		Applications
			firstName - String
			lastName - String
			email - String
			school - String (from list?)
			major - String
			year - String (from list?)
			github - String
			QAs - Array of answers to below questions
				[0] Will this be your first hackathon?
					(t/f)
				[1] What is one thing you hate about hackathons?
					(string)
				[2] What do you want to learn or hack on for the weekend?
					(array of strings)
				[3] What are some things you have made that you are proud of?
					(string)
				[4] Food Allergies 
					(array of strings)
				[5] Comments? 
					(array of strings)
				
	IDs
		-match parse ids except for QAs
		QA[0-5]
###

startParse()
