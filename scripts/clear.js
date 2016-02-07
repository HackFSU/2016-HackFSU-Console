/**
 * Imports hacks from .csv and saved in db
 */
'use strict';

import { Converter } from 'csvtojson';
import Hack from 'app/models/Hack';
import Parse from 'parse/node';

const HACK_CSV = __dirname + '/../data/hacks.csv';

Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();

let query = new Parse.Query(Hack);
query.find().then(function(all) {
	console.log('count', all.length);
	all.forEach(function(e) {
		e.set('judgedBy', []);
	});
	try{
		Parse.Object.saveAll(all).then(function(res){
			console.log('yay', res.length);
		}, function(err) {
			console.log('err');
		});
	}catch(er) {
		console.log('erre',er);
	}


}, function(err) {
	console.log('err');
});
