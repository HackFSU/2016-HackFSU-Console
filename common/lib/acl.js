/**
 * Access Control List (ACL) Module
 *
 * Determined by bits, so it has a max of 32 roles.
 */
'use strict';

/* jshint bitwise:false */

import _ from 'lodash';
import validate from './validate';

const MAX_ROLES = 32; // total bits


export default class ACL {

	constructor(o) {
		validate(o, _.isPlainObject);
		validate(o.roleNames, _.isArray);
		validate(o.getRoleIdFromRequest, _.isFunction);
		validate(o.denyMiddleware, _.isFunction);

		this.getRoleIdFromRequest = o.getRoleIdFromRequest;
		this.denyMiddleware = o.denyMiddleware;
		this.enforce = true;

		this.setRoles(o.roleNames);
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
	setRoles(roleNames) {
		let curr;	// id bit

		validate(roleNames, _.isArray);

		if(roleNames.length > MAX_ROLES) {
			throw new Error('Role count exceeds MAX_ROLES, ' + MAX_ROLES);
		}

		this.roles = {}; 			// id: name
		this.roleKeys = {};		// id: functionalId (combined with others)
		this.middleware = {};	// resultKey: function

		curr = 1;
		roleNames.forEach((name) => {
			this.roles[curr] = name;
			this.roleKeys[curr] = curr; // starts as original

			curr = curr << 1;
		});
	}

	setEnforce(value) {
		this.enforce = !!value;
	}

	hasRole(name) {
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id) && 
				this.roles[id] === name) {
				return true;
			}
		}
		return false;
	}

	getRoleId(name) {
		validate(name, (name) => {
			return this.hasRole(name);
		});

		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id) && 
				this.roles[id] === name) {
				return id;
			}
		}
	}

	getRoleName(id) {
		return this.roles[id];
	}

	/**
	 * Merges permissions of srcs into role.
	 * Does not account for inheritance.
	 */
	mergeRoles(dstRoleName, srcRoleNames) {
		let dstId, srcId;

		validate(srcRoleNames, function(val){
			return _.isArray(val) || _.isString(val);
		});

		if(_.isString(srcRoleNames)) {
			srcRoleNames = [srcRoleNames];
		}

		dstId = this.getRoleId(dstRoleName);

		srcRoleNames.forEach((name) => {
			srcId = this.getRoleId(name);
			this.roleKeys[dstId] |= srcId;
		});
	}


	/**
	 * Combines functional keys of given roles
	 */
	genACL(roleNames) {
		let key = 0;

		validate(roleNames, _.isArray);

		roleNames.forEach((name) => {
			key |= this.roleKeys[this.getRoleId(name)];
		});

		return key;
	}

	/**
	 * Checks two acl keys against one another
	 * Assumes k1 and k2 are rolekeys
	 */
	checkKey(k1, k2) {
		return !this.enforce || !!(+k1 & +k2);
	}

	/**
	 * Checks the role with the given
	 */
	// checkId(id, key) {
	// 	return this.enforce || this.hasRole(this.roles[id]) && !!(this.roleKeys[this.roles[id]] & key);
	// }

	/**
	 * Generates middleware function that accepts the given roles
	 */
	useAcl(...validRoles) {
		let aclKey = this.genACL(validRoles);
		let middleware = this.middleware[aclKey];

		if(!middleware) {
			middleware = this.middleware[aclKey] = (req, res, next) => {
				let roleId = this.getRoleIdFromRequest(req) || 0;

				if(this.checkKey(roleId, aclKey)) {
					// Passed ACL
					next();
					return;
				}
		
				// Failed ACL
				this.denyMiddleware(req, res, next);
			};
		}

		return middleware;
	}
}
