/**
 * Access Control List (ACL) Module
 *
 * Determined by bits, so it has a max number of roles.
 *
 * The ACL instance is shared between imports.
 *
 * The role logic should be performed on server boot to generate the needed
 * middleware functions.
 *
 * Stored Id's can be combined (xor) to act as multiple roles
 *
 * Different constructed keys:
 * id = specific id for role, should be 1 bit
 * roleKey = accessable roles' bits checked (if from user, a user IS all checked roles)
 * aclKey = combination of roleKeys
 */
'use strict';

/* jshint bitwise:false */

import _ from 'lodash';
import validate from 'lib/validate';

const MAX_ROLES = 64; // total bits


/**
 * Role
 * id - matches role itself, should be a single bit flag
 * roleKey - end key used in checks, may be merged with other Roles' ids
 */
class Role {
	constructor(acl, name, id, roleKey) {
		this.acl = acl;
		this.name = name;
		this.id = id;
		this.key = id || 0;
		this.key |= id;
	}

	/**
	 * Merges given roles' sourceKeys into role, effectivly allowing this role
	 * to act as these roles.
	 */
	canAccess(roleNames, inherit) {
		if(!_.isArray(roleNames)) {
			roleNames = [roleNames];
		}

		roleNames.forEach((name) => {
			this.key |= this.acl.role(name)[inherit ? 'key' : 'id'];
		});
	}
}

/**
 * Main Acl controller class.
 * roleNames - array of name strings
 * getRoleKeyFromRequest - getter for request key
 * denyMiddleware - called when key check fails for the request key
 */
export default class Acl {
	constructor(roleNames, getRoleKeyFromRequest, denyMiddleware) {
		validate(roleNames, _.isArray);
		validate(getRoleKeyFromRequest, _.isFunction);
		validate(denyMiddleware, _.isFunction);

		this.getRoleKeyFromRequest = getRoleKeyFromRequest;
		this.denyMiddleware = denyMiddleware;
		this.setRoles(roleNames);
		this.enforce = true;
	}

	setRoles(roleNames) {
		let curr;	// id bit

		if(roleNames.length > MAX_ROLES) {
			throw new Error('Role count exceeds MAX_ROLES, ' + MAX_ROLES);
		}

		this.roles = {};
		this.middleware = {};	// key: function

		curr = 1;
		roleNames.forEach((name) => {
			this.roles[curr] = new Role(this, name + '', curr);
			curr = curr << 1;
		});
	}

	setEnforce(value) {
		this.enforce = !!value;
	}

	/**
	 * Gets Role instance
	 * Should not be called after server is done initializing the acl.
	 */
	role(name) {
		let id = this.getRoleId(name);

		if(id) {
			return this.roles[id];
		}

		throw 'Role ' + name + ' not found';
	}

	/**
	 * Returns a key that is the combination of all given roles' ids
	 */
	_combine(roleNames) {
		let roleKey = 0;

		// find the roles
		roleNames.forEach((name) => {
			roleKey |= this.role(name).id;
		});

		return roleKey;
	}

	/**
	 * Checks two bitstrings against one another
	 */
	_check(k1, k2) {
		return !this.enforce || !!(+k1 & +k2);
	}

	/**
	 * Get role name from id. Assumes only one bit flipped in key as to match
	 * a role sourceKey
	 */
	getRoleName(id) {
		let role = this.roles[id];
		if(role) {
			return role.name;
		}
	}

	getRoleId(name) {
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id) && this.roles[id].name === name) {
				return id;
			}
		}
	}

	/**
	 * Middleware generator
	 */
	use(...validRoleNames) {
		let aclKey = this._combine(validRoleNames);
		let middleware = this.middleware[aclKey];

		if(!middleware) {
			middleware = this.middleware[aclKey] = (req, res, next) => {
				let roleKey = +this.getRoleKeyFromRequest(req) || 0;
				let success = aclKey === 0 || this._check(roleKey, aclKey);

				if(this.verbose) {
					console.log(
						'[ACL]',
						success? 'PASS' : 'DENY',
						`${roleKey.toString(2)}|${aclKey.toString(2)}`,
						'[' + validRoleNames.join(', ') + ']'
					);
				}

				if(success) {
					// Passed ACL
					res.locals.acl = this._loadRoles(roleKey);
					next();
					return;
				}

				// Failed ACL
				this.denyMiddleware(req, res, next);
			};
		}

		return middleware;
	}

	/**
	 * Loads the acl roles into local for easly testing
	 * acl.role = actual roles
	 * acl.access = role is accessable
	 */
	_loadRoles(roleKey) {
		let acl = {};
		let accessKey = roleKey;
		acl.isRole = {};
		acl.canAccess = {};

		// Identify acting roles
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id)) {
				let role = this.roles[id];

				acl.isRole[role.name] = this._check(roleKey, role.id);
				if(acl.isRole[role.name]) {
					accessKey |= role.key;
				}
			}
		}

		// Identify inerited role access
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id)) {
				let role = this.roles[id];

				acl.canAccess[role.name] = this._check(accessKey, role.id);
			}
		}

		return acl;
	}

	/**
	 * Returns an array containing the names of all roles in the roleKey
	 * Can be used for display purposes
	 */
	listRoles(roleKey) {
		let roleNames = [];
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id)) {
				let role = this.roles[id];
				if(this._check(roleKey, role.id)) {
					roleNames.push(role.name);
				}
			}
		}
		return roleNames;
	}

	/**
	 * Returns basic role data
	 * Keys/ids are in bitstring format for easy comparisons
	 */
	getRoles() {
		let roles = {};
		for(let id in this.roles) {
			if(this.roles.hasOwnProperty(id)) {
				let role = this.roles[id];
				roles[role.name] = {
					name: role.id + ' => ' + role.id.toString(2),
					key: role.key + ' => ' + role.key.toString(2)
				};
			}
		}
		return roles;
	}

	/**
	 * Returns a new key that is the combination of k1 + k2
	 */
	addKey(k1, k2) {
		return +k1 | +k2;
	}

	/**
	 * Returns a new key that is k1 - k2
	 */
	removeKey(k1, k2) {
		// remove like bits from k1 (AND has precedence)
		return +k1 ^ +k1 & +k2;
	}

}
