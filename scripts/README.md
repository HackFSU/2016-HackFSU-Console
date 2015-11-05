# Here be nice scripts for doing various sorts of things.

### Modelify
Usage: `node scripts/modelify.js ClassName attr1[!][:Type[!]] attr2...`

Currently, Type corresponds to a Lodash `_.is*` function, such as `_.isNumber`.
> If Type is not specified, modelify will still create a validator function
> for you to write your own validation method.

The optional `!` parameter (attached to attribute name or type) forces the
attribute to be non-falsey.
> That is, non-null, non-empty, non-undefined, etc.

Examples (`node scripts/` left out):
* `modelify.js Update title:String! subtitle:String` (title is a required string, subtitle is an optional string)
* `modelify.js Event name:String! startTime:Date! endTime!` (name is a required string,
	startTime is a required date, and endTime is a required attribute with a custom validator. See note.)

> **Note**: In a future version, we will support allowing custom validators to also include lodash tests.
> For example, in `Event` above, we want endTime to be a date but also be required to
> be *after* startTime. Currently, we have to code the entire validator by hand.
