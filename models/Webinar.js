var keystone = require('keystone'),
	moment = require('moment'),
	_ = require('underscore'),
	Types = keystone.Field.Types;

/**
 * Webinar Model
 * =============
 */

var Webinar = new keystone.List('Webinar', {
	autokey: { path: 'key', from: 'name', unique: true }
});

Webinar.add({
	name: { type: String, required: true, initial: true },
	publishedDate: { type: Types.Date, index: true },
	
	state: { type: Types.Select, options: 'draft, scheduled, active, past', noedit: true },
	
	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm' },
	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm' },
	
	link: { type: String, required: false, initial: true, width: 'medium', default: 'GotoMeeting URL', note: 'GoToMeetingURL' },
	video: { type: String, required: false, initial: true, width: 'medium', default: 'Youtube URL', note: 'Youtube URL' },

	description: { type: Types.Html, wysiwyg: true },
	
});





// Virtuals
// ------------------------------

Webinar.schema.virtual('url').get(function() {
	return '/webinars/' + this.key;
});



// Pre Save
// ------------------------------

Webinar.schema.pre('save', function(next) {
	
	var webinar = this;
	
	// If no published date, it's a draft webinar
	if (!webinar.publishedDate) webinar.state = 'draft';
	
	// If webinar date plus one day is after today, it's a past webinar
	else if (moment().isAfter(moment(webinar.startDate).add('day', 1))) webinar.state = 'past';
	
	// If publish date is after today, it's an active webinar
	else if (moment().isAfter(webinar.publishedDate)) webinar.state = 'active';
	
	// If publish date is before today, it's a scheduled webinar
	else if (moment().isBefore(moment(webinar.publishedDate))) webinar.state = 'scheduled';
	
	next();

});




// Methods
// ------------------------------

Webinar.schema.methods.notifyAttendees = function(req, res, next) {
	
	var webinar = this;
	
	keystone.list('User').model.find().where('notifications.webinars', true).exec(function(err, attendees) {

		if (err) return next(err);
		
		if (!attendees.length) {
			next();
		} else {
			attendees.forEach(function(attendee) {
				new keystone.Email('new-webinar').send({
					attendee: attendee,
					webinar: webinar,
					subject: 'New webinar: ' + webinar.name,
					to: attendee.email,
					from: {
						name: 'Satori',
						email: 'brenda@russellwilliamsgroup.com'
					}
				}, next);
			});
		}
		
	});
	
}



Webinar.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'startDate', 'endDate', 'link', 'video', 'description');
	}
});




/**
 * Registration
 * ============
 */

Webinar.addPattern('standard meta');
Webinar.defaultSort = '-startDate';
Webinar.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Webinar.register();
