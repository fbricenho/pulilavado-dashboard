import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogFormModal } from 'angular2-modal/plugins/vex';

@Component({
  selector: 'editarOrden',
  styleUrls: ['./editarOrden.scss'],
  templateUrl: './editarOrden.html'
})

export class EditarOrden implements OnInit {

  public aux$;
  public items: FirebaseListObservable<any>;
  public aux: boolean = false;
  public showAccount = [];
  public objectInfo: Object;

  query: string = '';
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: 'No hay registros almacenados',
    columns: {
      id: {
        title: 'Codigo',
        type: 'string',
        sort: true
      },
      name: {
        title: 'Nombre',
        type: 'string'
      },
      type: {
        title: 'Tipo',
        type: 'string'
      },
      price: {
        title: 'Precio',
        type: 'string'
      },
      status: {
        title: 'Estado',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  users: FirebaseListObservable<any>;
  clients: FirebaseListObservable<any>;
  productos: FirebaseListObservable<any>;

  constructor(
              af: AngularFire,
              public localSt: LocalStorageService,
              public route: Router,
              private overlay: Overlay,
              private vcRef: ViewContainerRef,
              private modal: Modal
  ) {
    this.users = af.database.list('/user/');
    this.productos = af.database.list('/product/');
    modal.overlay.defaultViewContainer = vcRef;
    this.loadOn();
  }

  public loadOn() {
    this.aux$ = this.productos.subscribe( (products) => {
      console.log(products);
      products.map((data) => {
        console.log(data);
        let aux: string = '';
        if (data.available === true) {
          aux = 'habilitado';
        }
        else {
          aux = 'deshabilitado';
        }
        let prod = {
          id: data.id.toString(),
          name: data.name,
          type: data.type,
          price: data.price,
          status: aux
        };
        this.showAccount.push(prod);
      });
      this.source.load(this.showAccount);
      this.aux$.unsubscribe();
    });
  }

  ngOnInit() {
    // Validate local session storage if there is an user
    if ((this.localSt.retrieve('user') && (this.localSt.retrieve('ordenKey')))) {
      this.users.subscribe((user: any[]) => {
        user.map((e) => {
          let passwordString: string = e.password.toString();
          if ((this.localSt.retrieve('user').email === e.email) &&
            (this.localSt.retrieve('user').password === passwordString)) {
            this.aux = true;
          }
        });
        if (this.aux) {
          // this.route.navigate(['/pages/home']);
        }
        else {
          this.localSt.clear();
          this.route.navigate(['/login']);
        }
      });
    }
    else {
      this.route.navigate(['/pages/home']);
    }
  }

  public onEdit(codigo, cantidad) {
    if ( (codigo) && (cantidad) ) {
      let producto$ = this.productos.subscribe( (product) => {
        let aux: boolean = false;
        product.map((productoM$) => {
          console.log('mapeando');
          if ( (productoM$.available === false) && (productoM$.id === codigo.toString()) ) {
            this.modal.alert()
                      .title('Producto deshabilitado')
                      .message('EL producto elegido no se encuentra disponible')
                      .okBtn('Cancelar')
                      .okBtnClass('btn btn-danger btn-raised')
                      .open();
            aux = true;
            producto$.unsubscribe();
          }
          else if ((productoM$.available === true ) && (productoM$.id === codigo.toString()) ) {
            console.log('guardar prod');
            aux = true;
            producto$.unsubscribe();
          }
        });
        if (aux) {
          this.modal.alert()
                    .title('Codigo invalido')
                    .message('Por favor, verifique el codigo');
        producto$.unsubscribe();
      }
      });
    }
    else {
      this.modal.alert()
                .title('Inconsistencia de datos')
                .message('Por favor ingrese todos los datos correctamente')
                .okBtn('Cancelar')
                .okBtnClass('btn btn-danger btn-raised')
                .open();
    }
  }
}
