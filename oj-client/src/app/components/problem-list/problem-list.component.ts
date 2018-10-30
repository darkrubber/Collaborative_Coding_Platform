import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
/*
const PROBLEMS: Problem[] = [
	{
		"id":1,
		"name":"Reverse Integer",
		"desc":"Given a 32-bit signed integer, reverse digits of an integer.",
		"difficulty":"easy"
	},
	{
		"id":2,
		"name":"Add Two NUmbers",
		"desc":"You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.",
		"difficulty":"medium"
	},
	{
		"id":3,
		"name":"Reverse Integer",
		"desc":"Given a 32-bit signed integer, reverse digits of an integer.",
		"difficulty":"medium"
	},
	{ 
		"id":4, 
		"name":"Triangle Count", 
		"desc":"Given an array of integers, how many three numbers can be found in the array, so that we can build an triangle whose three edges length is the three numbers that we find?", 
		"difficulty":"hard"
	}, 
	{
		"id":5, 
		"name":"Sliding Window Maximum", 
		"desc":"Given an array of n integer with duplicate number, and a moving window(size k), move the window at each iteration from the start of the array, find the maximum number inside the window at each moving.", 
		"difficulty":"super" 
	}
];
*/

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})

export class ProblemListComponent implements OnInit, OnDestroy {
	problems: Problem[];
	subscriptionProblems: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  	this.getProblems();
  }

  ngOnDestroy(){
  	this.subscriptionProblems.unsubscribe();
  }

  getProblems(){
  	//this.problems = this.dataService.getProblems();
  	this.subscriptionProblems = this.dataService.getProblems()
  		.subscribe( problems => this.problems = problems);
  }

}
