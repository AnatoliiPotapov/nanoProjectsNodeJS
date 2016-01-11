var mongoose = require('mongoose');
var Projects = mongoose.model('Projects');

module.exports = function(router) {


	router.get('/posts', function(req, res, next) {
	  Projects.find(function(err, posts){
	    if(err){ return next(err); }

	    res.json(posts);
	  });
	});

	router.param('post', function(req, res, next, id) {
	  var query = Projects.findById(id);

	  query.exec(function (err, post){
	    if (err) { return next(err); }
	    if (!post) { return next(new Error('can\'t find post')); }

	    req.post = post;
	    return next();
	  });
	});

	// return a post
	router.get('/posts/:post', function(req, res, next) {  
	    res.json(req.post);
	});

	// delete a post
	router.delete('/posts/:post/delete', function(req, res, next) {
	  req.post.remove(function(err) {
	    if (err) {
	      return next(err);
	    }
	    return res.sendStatus(204);
	  });
	});

	router.post('/posts', function(req, res, next) {

	  var post = new Projects(req.body);
	  console.log(post);

	  post.save(function(err, post){
	    if(err){ console.log(err); return next(err); }
	    res.json(post);
	  });

	});

	/*
	router.delete('/uploaded/files/:name', function(req, res) {
	  
	  uploader.delete(req, res, function(obj) {
	    res.send(JSON.stringify(obj));
	  });

	});
	*/

	return router;
}

