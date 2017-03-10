import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html'
})

export class Home implements OnInit {


  items: FirebaseListObservable<any>;

  constructor( af: AngularFire ) {
    this.items = af.database.list('/');
  }

  ngOnInit() {
    this.items.subscribe( (data) => {
      let cliente = data;
      console.log(cliente);
    });
  }
}
