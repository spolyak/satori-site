var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Store Items Model
 * ===========
 */

var StoreItem = new keystone.List('StoreItem', {
	map: { name: 'label' },
	autokey: { path: 'slug', from: 'label', unique: true }
});

StoreItem.add({
	label: { type: String, required: true, initial: true },
	href: { type: Types.Url, required: true, initial: true },
	description: { type: Types.Markdown, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true }
});


/**
 * Registration
 * ============
 */

StoreItem.addPattern('standard meta');
StoreItem.defaultColumns = 'label, href, author|20%, state|20%';
StoreItem.register();
