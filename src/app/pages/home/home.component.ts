import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
interface Cliente {
  id: {
    available: boolean
    nombre: string,
    cedula: string,
    correo: string,
    vehiculo: {
      id: {
        año: string,
        marca: string,
        modelo: string,
        tipo: string
      }
    }
  };
}
@Component({
  selector: 'home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html'
})

export class Home implements OnInit {


  items: FirebaseListObservable<any>;

  constructor( af: AngularFire ) {
    this.items = af.database.list('/cliente/');
  }

  ngOnInit() {
    this.items.subscribe( (data) => {
      let cliente: Cliente = data;
      console.log(cliente);
    });
  }
}
