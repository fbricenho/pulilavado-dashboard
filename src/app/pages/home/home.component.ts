import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalDataSource } from 'ng2-smart-table';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html'
})

export class Home implements OnInit {


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
    columns: {
      id: {
        title: 'ID',
        type: 'string'
      },
      name: {
        title: 'Name',
        type: 'string'
      },
      account: {
        title: 'Account',
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
    this.clients.subscribe((client) => {
      this.items.subscribe((order) => {
        this.productos.subscribe((inventariado) => {
          client.map( (cliente) => {
            let precio = 0;
            order.map( (orden) => {
              if ( (orden.idClient.toString() === cliente.$key) && (orden.available === true) ) {
                console.log('Cliente: ', cliente);
                console.log('Orden: ', orden);
                orden.product.map((producto) => {
                  console.log('productos: ', producto);
                    inventariado.map( (inventario) => {
                      if (inventario.$key === producto.id.toString()) {
                        console.log('Nombre', inventario.name);
                        precio = (inventario.price * producto.quantity) + precio;
                        // console.log(precio);
                      }
                    });
                    console.log('Precio: ', precio);
                });
                this.objectInfo = {
                  id: cliente.$key,
                  name: cliente.name,
                  account: precio + ' Bsf'
                };
                console.log(this.objectInfo);
                this.showAccount.push(this.objectInfo);
              }
            });
          });
          this.source.load(this.showAccount);
        });
      });
    });
    // this.source.load(this.showAccount);
  }
}
