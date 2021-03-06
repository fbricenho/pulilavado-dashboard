import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { Home } from './home.component';
import { NewOrder } from './newOrder/newOrder.component';
import { CloseOrder } from './closeOrder/closeOrder.component';
import { routing }       from './home.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule
  ],
  declarations: [
    Home,
    NewOrder,
    CloseOrder
  ],
  providers: []
})
export class HomeModule {}
