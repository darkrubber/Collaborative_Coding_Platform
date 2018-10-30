// let problems = [...]
// commented out the codes without database

const problemModel = require('../models/problemModel');

const getProblems = function(){
	// return new Promise( (resolve, reject) => {
	// 	resolve(problems);
	// });
	//
	return new Promise((resolve, reject) => {
		problemModel.find({}, (err, problems) => {
			if(err){
				reject(err);
			}else{
				resolve(problems);
			}
		});
	});
}

const getProblem = function(id){
	// return new Promise( (resolve, reject) => {
	// 	resolve(problems.find( problem => problem.id === id));
	// });
	return new Promise((resolve, reject) => {
		problemModel.findOne({id :id}, (err, problem) => {
			if(err){
				reject(err);
			}else{
				resolve(problem);
			}
		});
	});	
}

const addProblem = function(newProblem){
	// return new Promise( (resolve, reject) => {
	// 	//if problem already exist, reject
	// 	if(problems.find( problem => problem.name === newProblem.name)){
	// 		reject('Problem already exists');
	// 	}else{
	// 		newProblem.id = problems.length + 1;
	// 		problems.push(newProblem);
	// 		resolve(newProblem);
	// 	}
	// });
	return new Promise((resolve, reject) => {
		// check if the problem already exists
		problemModel.findOne({name: newProblem.name}, (err, data) =>{
			if(data){
				reject('Problem already exists');
			}else {
				//save to mongodb
				problemModel.count({}, (err, count) => {
					newProblem.id = count + 1;
					const mongoProblem = new problemModel(newProblem);
					mongoProblem.save();
					resolve(mongoProblem);
				});
			}

		});
	});
}

module.exports = {
	getProblems,
	getProblem,
	addProblem
}