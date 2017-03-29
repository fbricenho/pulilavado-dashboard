import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalDataSource } from 'ng2-smart-table';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'manage',
  styleUrls: ['./manage.scss'],
  templateUrl: './manage.html'
})

export class Manage implements OnInit {

  public view1Form: FormGroup;
  public inputEmail: AbstractControl;
  public inputName: AbstractControl;
  public inputPassword: AbstractControl;
  public inputRePassword: AbstractControl;
  public inputAvailable: AbstractControl;
  public aux: boolean = false;
  public view1: boolean = false;
  public view2: boolean = false;
  public view1M;
  users: FirebaseListObservable<any>;

  constructor(public localSt: LocalStorageService,
              public af: AngularFire,
              public route: Router,
              public fb: FormBuilder) {
  this.view1Form = fb.group({
        'inputEmail' : [this.view1M, Validators.compose([Validators.required, Validators.minLength(4)])],
        'inputName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'inputPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'inputRePassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'inputAvailable': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      });

    this.inputEmail = this.view1Form.controls['inputEmail'];
    this.inputName = this.view1Form.controls['inputName'];
    this.inputPassword = this.view1Form.controls['inputPassword'];
    this.inputRePassword = this.view1Form.controls['inputRePassword'];
    this.inputAvailable = this.view1Form.controls['inputAvailable'];


    this.users = af.database.list('/user/');
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
    console.log('cargado');
  }

  public onAccount(view1M: any) {
    if (this.validateEmail(view1M)) {
      console.log(view1M);
      this.users.subscribe( (data) => {
        let aux: boolean = false;
        data.map((e) => {
          if (e.email === view1M) {
            aux = true;
          }
        });
        if (aux) {
          console.log('coincidencia');
          this.view1 = !this.view1;
        }
        else {
          console.log('no hubo coincidencia');
        }
      });
    }
  }

  doView1Form(values: any) {
    console.log(this.view1Form.controls);
    console.log(this.view1M);
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
