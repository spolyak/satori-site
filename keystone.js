// Load .env for development environments
require('dotenv').load();

// Initialise New Relic if an app name and license key exists
if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
	require('newrelic');
}

/**
 * Application Initialisation
 */

var keystone = require('keystone'),
	pkg = require('./package.json');

keystone.init({

	'name': 'Satori',
	'brand': 'Satori',
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',
	'view cache': false,
	
	'emails': 'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,

	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'satori',
	
	'mandrill api key': process.env.MANDRILL_KEY,

	'google api key': process.env.GOOGLE_BROWSER_KEY,
	'google server api key': process.env.GOOGLE_SERVER_KEY,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,
	
	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,

	'basedir': __dirname
	
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.set('locals', {
	_: require('underscore'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('email locals', {
    logo_src: '/images/logo-email.gif',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7'
        }
    },	
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'staging') return 'http://satori-beta.herokuapp.com';
		if (keystone.get('env') === 'production') return 'http://www.satori-path.com';
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})()
});

/* keystone.set('nav', {
	'webinars': ['webinars'],	
//	'meetups': ['meetups', 'talks', 'rsvps'],
	'posts': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags'],
//	'links': ['links', 'link-tags', 'link-comments'],
//	'members': ['users', 'organisations'],	
	'members': ['users']	

}); */

keystone.set('nav', {
	'webinars': ['webinars'],	
	'posts': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags'],
	'store': ['store-items'],	
	'members': ['users']	
});

keystone.start();
