var mongoose = require('mongoose');

var ProjectsSchema = new mongoose.Schema({

	status: String,
   	name: String,
    shortDescription: String,
   	dateCreate: Date,
   	dateActual: Date,
   	filename: String
   	
});

mongoose.model('Projects', ProjectsSchema);
