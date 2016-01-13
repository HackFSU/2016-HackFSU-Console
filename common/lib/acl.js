/**
 * Access Control List (ACL) Module
 *
 * Determined by bits, so it has a max of 32 roles.
 *
 * The ACL instance is shared between imports.
 */
'use strict';

/* jshint bitwise:false */

import _ from 'lodash';
import validate from './validate';

const MAX_ROLES = 32; // total bits


/**
 * Static instance handling
 */
let instance;
function getInstance() {
	if(!instance) {
		throw Error("No instance. Initialization required.");
	}
	return instance;
}


// Initializes instance
export function initialize(o) {
	validate(o, _.isPlainObject);
	validate(o.roleNames, _.isArray);
	validate(o.getRoleIdFromRequest, _.isFunction);
	validate(o.denyMiddleware, _.isFunction);

	instance = {
		getRoleIdFromRequest: o.getRoleIdFromRequest,
		denyMiddleware: o.denyMiddleware,
		enforce: true
	};

	setRoles(o.roleNames);
}

/**
 * Sets ACL roles. Expects an object where the properties are the external
 * ids and their values are the role names.
 *
 *  	{
 * 		id1: 'SomeRole',
 * 		id2: 'SomeOtherRole',
 * 		...
 * 	}
 *
 */
export function setRoles(roleNames) {
	let acl = getInstance();
	let curr;	// id bit

	validate(roleNames, _.isArray);

	if(roleNames.length > MAX_ROLES) {
		throw new Error('Role count exceeds MAX_ROLES, ' + MAX_ROLES);
	}

	acl.roles = {}; 			// id: name
	acl.roleKeys = {};		// id: functionalId (combined with others)
	acl.middleware = {};	// resultKey: function

	curr = 1;
	roleNames.forEach((name) => {
		acl.roles[curr] = name;
		acl.roleKeys[curr] = curr; // starts as original

		curr = curr << 1;
	});
}

export function setEnforce(value) {
	getInstance().enforce = !!value;
}


/**
 * Returns id of role 'name', or nothing if the role does not exist
 */
export function getRoleId(name) {
	let acl = getInstance();

	for(let id in acl.roles) {
		if(acl.roles.hasOwnProperty(id) && 
			acl.roles[id] === name) {
			return id;
		}
	}

	// invalid role
}

export function getRoleName(id) {
	return getInstance().roles[id];
}

/**
 * Merges permissions of srcs into role.
 * Does not account for inheritance.
 */
export function mergeRoles(dstRoleName, srcRoleNames) {
	let acl = getInstance();
	let dstId, srcId;

	validate(srcRoleNames, function(val){
		return _.isArray(val) || _.isString(val);
	});

	if(_.isString(srcRoleNames)) {
		srcRoleNames = [srcRoleNames];
	}

	dstId = getRoleId(dstRoleName);

	srcRoleNames.forEach((name) => {
		srcId = getRoleId(name);
		acl.roleKeys[dstId] |= srcId;
	});
}

/**
 * Generates middleware function that accepts the given roles
 */
export function useAcl(...validRoles) {
	let acl = getInstance();
	let aclKey = genACL(validRoles);
	let middleware = acl.middleware[aclKey];

	if(!middleware) {
		middleware = acl.middleware[aclKey] = (req, res, next) => {
			let roleId = acl.getRoleIdFromRequest(req) || 0;

			if(checkKey(roleId, aclKey)) {
				// Passed ACL
				next();
				return;
			}
	
			// Failed ACL
			acl.denyMiddleware(req, res, next);
		};
	}

	return middleware;
}




/**
 * Combines functional keys of given roles
 */
function genACL(roleNames) {
	let key = 0;

	validate(roleNames, _.isArray);

	roleNames.forEach((name) => {
		key |= instance.roleKeys[getRoleId(name)];
	});

	return key;
}

/**
 * Checks two acl keys against one another
 * Assumes k1 and k2 are rolekeys
 */
function checkKey(k1, k2) {
	return !instance.enforce || !!(+k1 & +k2);
}