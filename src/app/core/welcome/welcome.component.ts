import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  getAuthState() {
    return this.store.select('auth');
  }
}
