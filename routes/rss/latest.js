var keystone = require('keystone'),
    Feed = require('feed');

var Link = keystone.list('Link');

exports = module.exports = function(req, res) {

	// Initializing feed object
    var feed = new Feed({
        title:          'Satori Latest Feed',
        description:    'The latest feed items from Satori!',
        link:           'http://satori-path.com',
        image:          'http://satori-path/images/satori-logo.png',
        copyright:      'Copyright © 2015 Satori. All rights reserved',

        author: {
            name:       'Brenda Russell Williams',
            email:      'brenda@russellwilliamsgroup.com',
            link:       'http://www.russellwilliamsgroup.com/'
        }
    });

    Link.model.find({},function(err, links) {
        if(err)
            res.send('404 Not found', 404);
        else {
            for(var key in links) {
                feed.addItem({
                    title:          links[key].label,
                    link:           links[key].href,
                    description:    links[key].description,
                    content:    	links[key].description,
                    date:           links[key].publishedDate
                });
            }
            // Setting the appropriate Content-Type
            res.set('Content-Type', 'text/xml');

            // Sending the feed as a response
            res.send(feed.render('rss-2.0'));
        }
    });

}
