import { Component, ViewContainerRef } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';

// MODAL
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogFormModal } from 'angular2-modal/plugins/vex';

declare let jsPDF;

@Component({
  selector: 'newOrder',
  styleUrls: ['./newOrder.scss'],
  templateUrl: './newOrder.html'
})

export class NewOrder {

  public orders$;
  public idInputModel;
  public aux: boolean = false;
  orders: FirebaseListObservable<any>;
  clients: FirebaseListObservable<any>;

  constructor(
    public route: Router,
    public af: AngularFire,
    private overlay: Overlay,
    private vcRef: ViewContainerRef,
    private modal: Modal,
    public fb: FormBuilder,
    public localSt: LocalStorageService
  ) {

    this.clients = af.database.list('/client/');
    this.orders = af.database.list('/buy');
  }

  onsubmit(): void {
    if (this.idInputModel) {
      this.aux = false;
      this.orders$ = this.orders.subscribe((ordenes) => {
        let i = 0;
        for (let e  of ordenes) {
          console.log(e);
          if ( (e.idClient.toString() === this.idInputModel.toString()) && (e.available === true) ) {
            this.orders$.unsubscribe();
            console.log('Coincidencia de compra');
            this.editOrden(e.idClient, e.$key);
            break;
          }
          if ( (e.idClient.toString() === this.idInputModel.toString()) && (e.available === false) ) {
            console.log('cliente registrado');
            this.aux = true;
          }
          if ( (this.aux === true) && ( i === ordenes.length ) ) {
            console.log('debe registrar nueva compra ya con cliente registrado');
            this.addOrden(this.idInputModel);
          }
          i++;
          if ( (i === ordenes.length) && (this.aux === false)  ) {
            console.log('debe registrar un nuevo ID');
            this.modal.alert()
                      .title('No se encontró la cedula')
                      .body(`Debes registrar un nuevo cliente en la seccion de Manejo de cuentas <br>` +
                            `O verifica que la cedula sea la correcta: <strong>` + this.idInputModel + `</strong>`)
                      .okBtn('Cancel')
                      .okBtnClass('btn btn-danger btn-raised')
                      .open();
          }
        }
      });
    }
    else {
      this.modal
        .alert()
        .size('sm')
        .title('Error')
        .body('¡Debes ingresar una cedula!')
        .okBtn('Ok')
        .okBtnClass('btn btn-danger btn-raised')
        .open();
    }
  }


  manageAcc(): void {
    this.route.navigate(['pages/manage']);
  }
  addOrden(cedula: any) {
    console.log(cedula);
  }

  editOrden(cedula: any, idOrden: string): void {
    console.log('Cedula: ' + cedula + ' ID ORDEN: ' + idOrden);
    this.modal
        .confirm()
        .title('Editar orden')
        .body('El cliente ' + ' ya posee una orden activa, desea agregarle algo mas?')
        .okBtn('Si')
        .okBtnClass('btn btn-primary btn-raised')
        .cancelBtn('No')
        .cancelBtnClass('btn btn-danger btn-raised')
        .open()
        .catch((err) => { console.log('ERROR'); })
        .then((dialog: any) =>  dialog.result )
        .then((result) => {
          this.localSt.store('ordenKey', {key: idOrden});
          this.route.navigate(['pages/editarOrden']);
        })
        .catch((err) => { console.log('Cancel/No button was press'); });

  }



  public saveFB(movimiento: string): void {
    let compra: Object = {
      available: true,
      date: new Date().toDateString(),
      idClient: this.idInputModel,
      product: [{
        id: 1001,
        quantity: 1
      },
      {
        id: 2001,
        quantity: 1
      }]
    };
    this.af.database.list('/buy/').push(compra);
    this.orders.push(compra);
  }
}
