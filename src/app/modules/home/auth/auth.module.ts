import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AddUserComponent } from './users/add-user/add-user.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { SharedModule } from '../../_sharedModule/SharedModule';
import { UserFunctionsComponent } from './users/user-functions/user-functions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMstComponent } from './users/user-mst/user-mst.component';
import { FunctionMstComponent } from './users/function-mst/function-mst.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AddUserComponent,
    UserDetailsComponent,
    UserFunctionsComponent,
    UserMstComponent,
    FunctionMstComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,    
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  exports:[
    BsDatepickerModule,
    NgSelectModule,
  ]
})
export class AuthModule { }
