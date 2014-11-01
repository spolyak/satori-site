var keystone = require('keystone'),
    Feed = require('feed');

var Post = keystone.list('Post');

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

    // Function requesting the last 5 posts to a database. This is just an
    // example, use the way you prefer to get your posts.
    Post.model.find({},function(err, posts) {
        if(err)
            res.send('404 Not found', 404);
        else {
            for(var key in posts) {
                feed.addItem({
                    title:          posts[key].title,
                    link:           '/blog/post/' + posts[key].slug,
                    description:    posts[key].content.brief,
                    content:    posts[key].content.extended,
                    date:           posts[key].publishedDate
                });
            }
            // Setting the appropriate Content-Type
            res.set('Content-Type', 'text/xml');

            // Sending the feed as a response
            res.send(feed.render('rss-2.0'));
        }
    });

}
