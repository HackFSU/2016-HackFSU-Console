#for running correctly on remote

nodemon:
	coffee -o public/js -cw public/coffee &
	nodemon --delay 3