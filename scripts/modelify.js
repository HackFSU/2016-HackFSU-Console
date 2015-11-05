/**
* Generates beautiful ES6-based Parse models for use in our app. It even does
* validations! You still have to add some custom things though... but it's a
* nice start.
*
* Hand crafted with love by Trevor.
*/

'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var klass = process.argv[2];
var attrs = _lodash2.default.drop(process.argv, 3);

var model = '\nexport default function (app) {\n\tconst PARSE_CLASSNAME = \'' + klass + '\';\n\n\tconst Parse = app.Parse;\n\tconst _ = app._;\n\tconst validate = app.validate;\n\n\tclass ' + klass + ' extends Parse.Object {\n\t\tconstructor(o) {\n\t\t\tsuper(PARSE_CLASSNAME);\n\n\t\t\to = validate(o, _.isObject);\n';

// Parse each attribute. Type (i.e. what we will validate the attribute with) comes after a colon,
// like so: name:type(!). Optional ! at th end of type forces the attribute to be non-empty and
// non-null before it can be validated.
// TODO: For non-typed attributes (aka user might add custom validation methods), allow ! to be
// appended directly to the name. Example, 'modelify Update title! subtitle!'
_lodash2.default.each(attrs, function (attr) {
	attr = attr.split(':');
	var name = attr[0];
	var type = attr[1];
	var force = type[type.length - 1];

	// For now, this only supports lodash methods and calls _.is{Type} function.
	// TODO: Support custom entries.
	// TODO: Support force.
	model += '\t\t\tthis.' + name + ' = validate(o.' + name + ', _.is' + type + ');\n'; // TODO: Uppercase first letter to support lowercase types in the cmd line?
});

model += '\n\t\t}\n\t}\n\n\tapp.model.' + klass + ' = ' + klass + ';\n\tParse.Object.registerSubclass(PARSE_CLASSNAME, ' + klass + ');\n}\n';

_fs2.default.writeFile('app/models/' + klass + '.js', model, function (err) {
	if (err) {
		throw err;
	}
	console.log('Model ' + klass + ' created as app/models/' + klass + '.js\n');
});
//# sourceMappingURL=modelify.js.map
