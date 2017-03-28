import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

// MODAL
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogFormModal } from 'angular2-modal/plugins/vex';

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
              public       route: Router,
              public          af: AngularFire,
              private    overlay:   Overlay,
              private      vcRef:   ViewContainerRef,
              private      modal:   Modal,
            ){
    overlay.defaultViewContainer = this.vcRef;
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
            this.modal
              .confirm()
              .titleHtml('Cerrar orden')
              .showClose(false)
              .isBlocking(true)
              .body('Facturar la orden del ID: ' + e.idClient)
              .cancelBtn('No')
              .cancelBtnClass('btn btn-danger btn raised')
              .okBtn('Si')
              .okBtnClass('btn btn-primary btn-raised')
              .open()
              .catch((err) => {console.log('error'); })
              .then((dialog: any) => dialog.result)
              .then(() => { this.setUnavailable(value, auxObj, orders$); })
              .catch((err) => {console.log('cancelado'); } );
          }
        });
      });
    }
    else {
      this.modal.alert()
                .size('sm')
                .title('Error')
                .message('Debe elegir una orden')
                .okBtn('Ok')
                .okBtnClass('btn btn-danger btn-raised')
                .open();
    }
    //
  }

  public setUnavailable(value: string, auxObj: Object, orders$) {

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
      this.route.navigate(['']);
    });
  }
}
