import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
	collaborationSocket: any;
  private _userSource = new Subject<string>();

  constructor() { }

  init(editor: any, sessionId: string): Observable<string>{
  	//est. socket connection
  	this.collaborationSocket = io(window.location.origin, { query: 'sessionId='+ sessionId});
  	// receive change from server and apply it to local browser
  	this.collaborationSocket.on('change', (delta: string) => {
  		// delta = change (convention)
  		console.log('collaboration: editor changes '+ delta);
  		delta = JSON.parse(delta);
  		editor.lastAppliedChange = delta;
  		editor.getSession().getDocument().applyDeltas([delta]);
  	});

  	// this.collaborationSocket.on('message', (message) => {
  	// 	console.log('message received from server:' + message);
  	// });

    // add for displaying users
    this.collaborationSocket.on('userChange', (data: string[])=> {
      console.log('collaboration users change: ' + data);
      this._userSource.next(data.toString());
    });
    return this._userSource.asObservable();

  }

  //send to server and distribute to others
  change(delta: string): void {
  	this.collaborationSocket.emit('change',delta);
  }

  //restore buffer from redis cacahe
  restoreBuffer(): void{
  	this.collaborationSocket.emit("restoreBuffer");
  }
}
