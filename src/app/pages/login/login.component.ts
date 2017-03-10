import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService, LocalStorage, SessionStorageService } from 'ng2-webstorage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login implements OnInit {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public usuario;

  users: FirebaseListObservable<any>;

  constructor(fb: FormBuilder,
              af: AngularFire,
              public localSt: LocalStorageService,
              private route: Router
              ) {
    this.users = af.database.list('/user/');
    this.form = fb.group({
      'email': ['fbricenho@gmail.com', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['123456789', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    if (this.localSt.retrieve('user')) {
      this.route.navigate(['pages/home']);
    }
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.users.subscribe((user: any[]) => {
        user.map((e) => {
          let passwordString: string = e.password.toString();
          if ((this.email.value === e.email) && (this.password.value === passwordString)) {
            this.usuario =  {
              email: this.email.value,
              password: this.password.value
            };
            this.localSt.store('user', {email: this.usuario.email, password: this.usuario.password});
            this.route.navigate(['pages/home']);
          }
        });
      });
    }
  }
}
