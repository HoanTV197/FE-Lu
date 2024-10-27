import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Adm004Component } from './adm004/adm004.component';
import { Adm005Component } from './adm005/adm005.component';
import { DepartmentService } from '../../../app/service/department.service';
import { CertificationService } from '../../../app/service/certification.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { Adm006Component } from './adm006/adm006.component';
import { Adm003Component } from './adm003/adm003.component'; 


@NgModule({
  declarations: [
    UserListComponent,
    Adm004Component,
    Adm005Component,
    Adm006Component,
    Adm003Component,
  ],
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [DepartmentService, CertificationService, EmployeeService]
})
export class UsersModule { }
