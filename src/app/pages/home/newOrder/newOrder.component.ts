import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'newOrder',
  styleUrls: ['./newOrder.scss'],
  templateUrl: './newOrder.html'
})

export class NewOrder {

  public idInputModel;
  orders: FirebaseListObservable<any>;
  clients: FirebaseListObservable<any>;

  constructor(
              public route: Router,
              public af: AngularFire
            ){
    this.clients = af.database.list('/client/');
    this.orders = af.database.list('/buy');

    // this.id = this.form.controls['inputId'];
  }

  onsubmit(): void {
    if (this.idInputModel) {
      let aux: boolean = false;
      let movimiento: string = '';
      let orders$ = this.orders.subscribe((data) => {
        data.map((e) => {
          if ((e.idClient === this.idInputModel) && (e.available === true)) {
            aux = true;
            movimiento = e.$key;
          }
        });
        if (aux) {
          console.log('Coincidencia: ', this.idInputModel);
          console.log(movimiento);
          this.route.navigate(['']);
          orders$.unsubscribe();
        }
        else {
          console.log('Puedes proseguir: ', this.idInputModel);
        }
      });

    }
  }

  public saveFB(movimiento: string): void {
    let compra: Object = {
        available : true,
        date : new Date().toDateString(),
        idClient : this.idInputModel,
        product : [ {
            id : 1001,
            quantity : 1
          },
          {
            id: 2001,
            quantity: 1
        } ]
      };
      this.af.database.list('/buy/').push(compra);
      this.orders.push(compra);
  }
}
