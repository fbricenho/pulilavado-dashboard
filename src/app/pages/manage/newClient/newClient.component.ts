import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalDataSource } from 'ng2-smart-table';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'new-client',
  styleUrls: ['./newClient.scss'],
  templateUrl: './newClient.html'
})

export class NewClient {

  public view2: boolean = false;
  users: FirebaseListObservable<any>;

  constructor(public localSt: LocalStorageService,
              public af: AngularFire,
              public route: Router,
              public fb: FormBuilder) {


    this.users = af.database.list('/user/');
  }


  public searchClient() {
    console.log('cargado');
  }

}
