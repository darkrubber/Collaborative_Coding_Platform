import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
// Client side routing
// define routes
const routes: Routes = [
	{
		path: '',
		redirectTo: 'problems',
		pathMatch: 'full'
	},
	{
		path:'problems',
		component: ProblemListComponent
	},
	{
		path: 'problems/:id', //placeholder
		component: ProblemDetailComponent
	},
	{
		path: '**',
		redirectTo: 'problems'
	}
];

export const routing = RouterModule.forRoot(routes);