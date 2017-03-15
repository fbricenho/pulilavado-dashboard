import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'logout',
  styleUrls: ['./logout.scss'],
  templateUrl: './logout.html'
})

export class Logout implements OnInit {

    constructor(
        public route: Router,
        public cookieUser: LocalStorageService
    ){}

    ngOnInit() {
        this.cookieUser.clear();
        this.route.navigate(['login']);
    }
}
