import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

// MODAL
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogFormModal } from 'angular2-modal/plugins/vex';

declare let jsPDF;

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
    public af: AngularFire,
    private overlay: Overlay,
    private vcRef: ViewContainerRef,
    private modal: Modal,
  ) {
    overlay.defaultViewContainer = this.vcRef;
    this.orders = af.database.list('/buy');
    this.loadOn();
  }

  public loadOn() {
    let aux = this.orders.subscribe((data) => {
      data.map((e) => {
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
      let orders$ = this.orders.subscribe((data) => {
        data.map((e) => {
          if (e.$key === value) {
            this.modal
              .confirm()
              .titleHtml('Cerrar orden')
              .showClose(false)
              .isBlocking(true)
              .body('Facturar la orden de la cedula: ' + e.idClient)
              .cancelBtn('No')
              .cancelBtnClass('btn btn-danger btn raised')
              .okBtn('Si')
              .okBtnClass('btn btn-primary btn-raised')
              .open()
              .catch((err) => { console.log('error'); })
              .then((dialog: any) => dialog.result)
              .then(() => { this.setUnavailable(value, auxObj, orders$); })
              .catch((err) => { console.log('cancelado'); });
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

    let factura$ = this.af.database.object('/buy/' + value).subscribe((oM) => {
      let productoClientO = oM.product;
      let cliente$ = this.af.database.list('/client/').subscribe((clientes$) => {
        clientes$.map((clienteM$) => {
          if (oM.idClient.toString() === clienteM$.id.toString()) {
            let facturaCliente = {
              cedula: oM.idClient,
              nombre: clienteM$.name,
              fecha: new Date().toDateString() + new Date().getHours().toString(),
              producto: []
            };
            this.af.database.list('/product').subscribe((productos$) => {
              let i = 0;
              productos$.map((productoM$) => {
                productoClientO.map((prodClientM$) => {
                  if (productoM$.id.toString() === prodClientM$.id.toString()) {
                    i++;
                    facturaCliente.producto.push({
                      cantidad: prodClientM$.quantity,
                      name: productoM$.name,
                      tipo: productoM$.type,
                      price: productoM$.price,
                    });
                    if (i === productoClientO.length) {
                      auxObj = {
                        available: false,
                        date: oM.date,
                        idClient: oM.idClient,
                        product: oM.product
                      };
                      this.af.database.object('/buy/' + value).remove();
                      this.orders.push(auxObj);
                      factura$.unsubscribe();
                      this.generarFactura(facturaCliente);
                    }
                  }
                });
              });
            });
          }
        });
      });
    });
  }

  public generarFactura(value: any) {
    console.log(value);
    let y = 60;
    let precio = 0;
    let doc = new jsPDF();
    doc.setFontSize(5);
    doc.text(150, 5, Date());
    doc.setFontSize(20);
    doc.setTextColor(0, 171, 255);
    doc.text(103, 10, 'CAR WASH', null, null, 'center');
    doc.setTextColor(0);
    doc.line(35, 20, 170, 20);
    doc.setFontSize(10);
    doc.text(50, 30, 'Nombre: ' + value.nombre);
    doc.text(50, 40, 'Cedula: ' + value.cedula);
    doc.setFontSize(12);
    doc.text(35, 60, 'Nombre');
    doc.text(85, 60, 'Tipo');
    doc.text(115, 60, 'Cantidad');
    doc.text(155, 60, 'Costo');
    doc.line(35, 65, 170, 65);
    console.log(value.producto);
    doc.setFontSize(10);
    value.producto.map( (producto) => {
      console.log(producto);
      y = y + 10;
      doc.text(35, y, producto.name);
      doc.text(85, y, producto.tipo);
      doc.text(115, y, producto.cantidad.toString());
      precio = (producto.price * producto.cantidad) + precio;
      doc.text(155, y, '' + producto.price.toString() + 'Bsf');
    });
    // Save the PDF
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(140, 260, 'Total facturado');
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(140, 270, '' + precio + 'Bsf');
    doc.setFontSize(12);
    doc.line(10, 280, 205, 280);
    doc.text(108, 285, 'CARWASH', null, null, 'center');
    doc.save('Factura a nombre de ' + value.nombre + ' Cedula ' + value.cedula + '.pdf');
    this.route.navigate(['']);

  }
}
