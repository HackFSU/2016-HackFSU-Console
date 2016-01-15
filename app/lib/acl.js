/**
 * Access Control List (ACL) Module
 *
 * Determined by bits, so it has a max number of roles.
 *
 * The ACL instance is shared between imports.
 *
 * The role logic should be performed on server boot to generate the needed
 * middleware functions.
 */
'use strict';

/* jshint bitwise:false */

import _ from 'lodash';
import validate from './validate';

const MAX_ROLES = 64; // total bits


/**
 * Role
 * id - matches role itself, should be a single bit flag
 * key - end key used in checks, may be merged with other Roles' ids
 */
class Role {
	constructor(name, id, key) {
		this.name = name;
		this.id = id;
		this.key = key || 0;
		this.key |= id;
	}

	/**
	 * Merges given roles' sourceKeys into role, effectivly allowing this role
	 * to act as these roles. 
	 */
	canAccess(roleNames, inherit) {
		let acl = Acl.getInstance();

		if(!_.isArray(roleNames)) {
			roleNames = [roleNames];
		}

		roleNames.forEach(function(name) {
			this.key |= acl.role(name)[inherit? 'key', 'id']();
		})
	}
}

let staticAclInstance;

class Acl {
	constructor(roleNames, getRoleIdFromRequest, denyMiddleware) {
		this.getRoleIdFromRequest = getRoleIdFromRequest;
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
			this.roles[curr] = new Role(name, curr);
			curr = curr << 1;
		});
	}

	setEnforce(value) {
		this.enforce = !!value;
	}

	static getInstance() {
		if(!staticAclInstance) {
			throw Error("No instance. Initialization required.");
		}
		return staticAclInstance;
	}

	/**
	 * Gets Role instance
	 * Should not be called after server is done initializing the acl.
	 */
	role(name) {
		let id = this.getRoleId(roleName);

		if(id) {
			return this.roles[id];
		}
		
		throw 'Role ' + name + ' not found';
	}

	/**
	 * Returns a key that is the combination of all given roles' ids
	 */
	combine(roleNames) {
		let key = 0;

		// find the roles
		roleNames.forEach(function(name) {
			key |= this.role(name).id;
		});

		return key;
	}

	/**
	 * Checks an id against a key. Invalid id's are treated as 0 (guest)
	 */
	check(id, key) {
		if(!this.roles[id]) {
			id = 0;
		}
		return !this.enforce || !!(id & key); 
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
			if(this.roles.hasOwnProperty(id) && this.roles[id].name === roleName) {
				return id;
			}
		}
	}

	/**
	 * Middleware generator
	 */
	use(validRoleNames) {
		let aclKey = this.combine(validRoles);
		let middleware = this.middleware[aclKey];

		if(!middleware) {
			middleware = this.middleware[aclKey] = (req, res, next) => {
				let roleId = +this.getRoleIdFromRequest(req) || 0;

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


// Initializes instance
export function initialize(o) {
	validate(o, _.isPlainObject);
	validate(o.roleNames, _.isArray);
	validate(o.getRoleIdFromRequest, _.isFunction);
	validate(o.denyMiddleware, _.isFunction);

	staticAclInstance = new Acl(
		o.roleNames
		o.getRoleIdFromRequest,
		o.denyMiddleware
	);
}

/**
 * Abstracted API for use
 */
export function role(roleName) {
	Acl.getInstance().role(roleName);
}
export function use(...validRoleNames) {
	Acl.getInstance().use(validRoleNames);
}
export function getRoleName(key) {
	return Acl.getInstance().getRoleName(key);
}
export function getRoleId(name) {
	return Acl.getInstance().getRoleId(name);
}