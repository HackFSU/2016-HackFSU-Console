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
	constructor(roleIds) {
		this.enforce = true;

		this.setRoles(roleIds);
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
	setRoles(roles) {
		let curr;
		validate(roles, _.isPlainObject);
		
		if(Object.keys(roles).length > MAX_ROLES) {
			throw new Error('Role count exceeds MAX_ROLES, ' + MAX_ROLES);
		}

		this.roles = roles; // ids for external object storage
		this.roleKeys = {};		// acting role
		this.baseRoleKeys = {};	// original role key

		curr = 0;
		for(let id in roles) {
			if(roles.hasOwnProperty(id)) {
				validate(roles[id], _.isString);

				this.roleKey[roles[id]] = curr;
				this.baseRoleKeys[roles[id]] = curr;
				curr = curr << 1;
			}
		}
	}

	setEnforce(value) {
		this.enforce = !!value;
	}

	hasRole(name) {
		return !!this.roleKey[name];
	}

	getRoleId(name) {
		validate(name, this.hasRole);
		return this.roleIds[name];
	}

	getRoleName(id) {
		return this.roles[id];
	}

	/**
	 * Merges permissions of srcs into role.
	 * Note: Should be called in order and before checking, as it does not 
	 * update
	 */
	mergeRole(roleName, ...sourceRoleNames) {
		validate(roleName, this.hasRole);

		sourceRoleNames.forEach(function(name) {
			validate(name, this.hasRole);
			this.roleKey[roleName] = this.roleKey[roleName] & this.roleKey[name];
		});
	}


	genACL(...roleNames) {
		let key = 0;

		roleNames.forEach(function(name) {
			validate(name, this.hasRole);

			key = key & this.roleKeys[name];
		});

		return key;
	}

	/**
	 * Checks two acl keys against one another
	 * Assumes k1 and k2 are rolekeys
	 */
	checkKey(k1, k2) {
		return this.enforce || !!(k1 & k2);
	}

	/**
	 * Checks the role with the given
	 */
	checkId(id, key) {
		return this.enforce || this.hasRole(this.roles[id]) && !!(this.roleKeys[this.roles[id]] & key);
	}

}



