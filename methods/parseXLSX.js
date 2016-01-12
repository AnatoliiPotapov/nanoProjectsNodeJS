var xlsx = require('node-xlsx');
var fs = require('fs');

var dictionary = {

    1:"project",
    2:"status",
    3:"type",
    5:"initiator",
    6:"partner1",
    7:"partner2",
    8:"partner3",
    17:"UCTT_capex",
    18:"UCTT_opex",
    19:"PARTNER_capex",
    20:"PARTNER_opex",
    21:"MULT_capex",
    22:"MULT_opex",
    23:"MAIN_capex",
    24:"MAIN_opex",
    33:"UCTT",
    34:"TK",
    35:"part1",
    36:"part2",
    37:"part3",
    38:"part4",
    39:"part5"

};

var keys = Object.keys(dictionary);


exports.data = {};

// Parse xlsx file
exports.parse = function(path) {
  var obj = xlsx.parse(__dirname + '/../' + path); // parse a file
  exports.data = obj;
  return(obj);
}

exports.save = function(path) {

	var outputFilename = __dirname + '/../' + path;
	var data = exports.process();

	fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	}); 
}

exports.process = function() {
    var projectsData = exports.data[0].data.slice(4);
    
    for (var index = 0; index < projectsData.length; index++) {

        var entry = projectsData[index];
        var output = {}; 
        // for each project

        for ( var iterator = 0; iterator < keys.length; iterator++) {
            var key = parseInt(keys[iterator]);
            var argument;
            if (entry[key-1] == undefined) { argument = ""; }
            else { argument = entry[key-1]; };
            output[dictionary[key]] =  argument; 
        }

        // aggregating properties

        output["capex"] = [output["UCTT_capex"],output["PARTNER_capex"],output["MULT_capex"],output["MAIN_capex"]];
        output["opex"]  = [output["UCTT_opex"],output["PARTNER_opex"],output["MULT_opex"],output["MAIN_opex"]];

        delete output["UCTT_capex"];
        delete output["PARTNER_capex"];
        delete output["MULT_capex"];
        delete output["MAIN_capex"];

        delete output["UCTT_opex"];
        delete output["PARTNER_opex"];
        delete output["MULT_opex"];
        delete output["MAIN_opex"];

        output["shares"] = [
            output["UCTT"],output["TK"],output["part1"],output["part2"],
            output["part3"],output["part4"],output["part5"]
        ];

        delete output["UCTT"];
        delete output["TK"];
        delete output["part1"];
        delete output["part2"];
        delete output["part3"];
        delete output["part4"];
        delete output["part5"];

        //console.log(output);
        projectsData[index] = output;
    };

    console.log(projectsData);
    return(projectsData);
}

