const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const problemService = require('../services/problemService');

const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

// executor 
EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL,'POST');

router.get('/problems', (req, res)=>{
	problemService.getProblems()
		.then(problems => res.json(problems));
});

//get single problem
router.get('/problems/:id', (req, res) => {
	const id = req.params.id;
	problemService.getProblem(+id)
		.then( problem => res.json(problem));
});

// add a problem
router.post('/problems', jsonParser, (req, res) => {
	problemService.addProblem(req.body)
		.then(problem => {
			res.json(problem);
		}, error => {
			res.status(400).send('No Duplicate Name is Allowed!');
		});
});

// this build_and _run is requested from oj-client 
router.post('/build_and_run', jsonParser, (req, res) => {
	const code = req.body.code;
	const lang = req.body.lang;

	console.log('lang:',lang, ' code:', code);

	//this build_and _run is an API on executor
	restClient.methods.build_and_run(
	{
		data: {code: code, lang: lang},
		headers: {'Content-Type': 'application/json'}
	},
	// data and response from the executor
	(data, response) => {
		const text = `Build output: ${data['build']}, execute output: ${data['run']}`;
		res.json(text); // package the result from executor and send it back to oj-client
	});
});

module.exports = router;