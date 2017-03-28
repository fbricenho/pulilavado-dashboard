import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { NewOrder } from './newOrder.component';
// import { routing }       from './newOrder.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    // routing
  ],
  declarations: [
    NewOrder
  ],
  providers: []
})
export class NewOrderModule {}
