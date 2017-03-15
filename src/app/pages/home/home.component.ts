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

  constructor(
                          af: AngularFire,
              public localSt: LocalStorageService,
              public   route: Router) {
    this.users = af.database.list('/user/');
    this.clients = af.database.list('/client/');
    this.items = af.database.list('/buy/');
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
    this.items.subscribe((data) => {
      // Verify if there is data
      if (data.length > 0) {
        // maping of the array
        data.map((e) => {
          if (e.payed === false) {
            // varify if the pay or not
            this.clients.subscribe((client) => {
              // get data of the client
              client.map( (cliente) => {
                if (cliente.$key === e.idClient.toString()) {
                  let id = e.idClient;
                  console.log('data:');
                  console.log(data);
                  console.log('client:');
                  console.log(client);
                  console.log('cliente.name:');
                  console.log(cliente.name);
                  let name = cliente.name;
                  let objectInfo: Object = {
                    id,
                    name,
                    account: '3000'
                  };
                  console.log(objectInfo);
                  this.showAccount.push(objectInfo);
                  this.source.load(this.showAccount);
                }
              });
            });
          }
        });
      }
    });
  }
}
