import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { CloseOrder } from './closeOrder.component';
// import { routing }       from './CloseOrder.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    // routing
  ],
  declarations: [
    CloseOrder
  ],
  providers: []
})
export class CloseOrderModule {}
