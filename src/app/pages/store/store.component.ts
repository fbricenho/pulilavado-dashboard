import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalDataSource } from 'ng2-smart-table';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'store',
  styleUrls: ['./store.scss'],
  templateUrl: './store.html'
})

export class Store implements OnInit {

  public codigo;
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
              public      af: AngularFire,
              public localSt: LocalStorageService,
              public   route: Router) {
    this.users = af.database.list('/user/');
    this.clients = af.database.list('/client/');
    this.items = af.database.list('/buy/');
    this.productos = af.database.list('/product/');
    this.loadOn();
  }

  ngOnInit() {
    // Validate local session storage if there is an user
    if (this.localSt.retrieve('user')) {
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
      this.route.navigate(['/login']);
    }
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

  public restaurarProd(codigo) {
    // this.saveFB(codigo.toString());
  }

   public saveFB(codigo: string): void {
    let compra: Object = {
        available : true,
        id: codigo,
        name: 'Aceite ST 15W40',
        price: 15000,
        type: 'Producto'
      };
    this.af.database.list('/product/').push(compra);
    this.route.navigate(['pages/store']);
    // this.productos.push(compra);
  }
}
