var keystone = require('keystone'),
	moment = require('moment');

var Webinar = keystone.list('Webinar');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'webinars';
	locals.page.title = 'Webinars - Satori';
	
	view.query('upcomingWebinar',
		Webinar.model.findOne()
			.where('state', 'active')
			.sort('-startDate')
	, 'talks[who]');
	
	view.query('pastWebinars',
		Webinar.model.find()
			.where('state', 'past')
			.sort('-startDate')
	, 'talks[who]');
	
	view.on('render', function(next) {
	
		if (!req.user || !locals.upcomingWebinar) return next();
		
		/* RSVP.model.findOne()
			.where('who', req.user._id)
			.where('meetup', locals.upcomingMeetup)
			.exec(function(err, rsvp) {
				locals.rsvpStatus = {
					rsvped: rsvp ? true : false,
					attending: rsvp && rsvp.attending ? true : false
				}
				return next();
			}); */
			
	});
	
	view.render('site/webinars');
	
}
