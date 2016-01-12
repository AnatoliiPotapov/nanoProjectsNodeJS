var mongoose = require('mongoose');
var Parser = require('../methods/parseXLSX');

var ProjectsSchema = new mongoose.Schema({

	status: String,
   	name: String,
    shortDescription: String,
   	dateCreate: Date,
   	dateActual: Date,
   	filename: String,
   	json: Object

});

ProjectsSchema.methods.process = function(cb) {
  Parser.parse('public/uploaded/files/' + this.filename);
  this.json = Parser.process();
  this.save(cb);
};

mongoose.model('Projects', ProjectsSchema);
