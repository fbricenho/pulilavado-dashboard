import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'closeOrder',
  styleUrls: ['./closeOrder.scss'],
  templateUrl: './closeOrder.html'
})

export class CloseOrder {

  public idInput;
  public ordenesActivas = [];
  orders: FirebaseListObservable<any>;

  constructor(
              public route: Router,
              public af: AngularFire
            ){
    this.orders = af.database.list('/buy');
    this.loadOn();
  }

  public loadOn() {
    let aux = this.orders.subscribe( (data) => {
      data.map( (e) => {
        if (e.available === true) {
          // console.log(e);
          this.ordenesActivas.push(e);
        }
      });
      // this.ordenesActivas.push(data);
      // console.log('Ordenes Activas: ', this.ordenesActivas);
      aux.unsubscribe();
    });
  }

  public onsubmit(value: any): void {
    if (value) {
      let auxObj: Object;
      let orders$ = this.orders.subscribe( (data) => {
        data.map((e) => {
          if ( e.$key === value ) {
            let objeto$ = this.af.database.object('/buy/' + value).subscribe( (oM) => {
              auxObj = {
                'available': false,
                'date': oM.date,
                'idClient': oM.idClient,
                'product': oM.product
              };
              this.af.database.object('/buy/' + value).remove();
              this.orders.push(auxObj);
              console.log(auxObj);
              objeto$.unsubscribe();
              orders$.unsubscribe();
              this.route.navigate(['']);
            });
          }
        });
      });
    }
    else {
      console.log('no selecionaste');
    }
    //
  }
}
