import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login';
import { MenuHeading } from '../models/MenuHeading';
import { SelectOccupationsDto } from '../models/SelectOccupationsDto';
import { UserFunctionDto } from '../models/UserFunctions/UserFunctionDto';
import { DbCommonService } from './db-common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 
// Getting base URL of Api from enviroment.
 baseUrl = environment.KUPFApiUrl;

 // 
 loginDto: Login[];
 //
 menuHeading: MenuHeading[]=[];

 occupationsDto$: Observable<SelectOccupationsDto[]>;
 occupationsDto: SelectOccupationsDto[]=[];
 
  constructor(private httpClient: HttpClient,
    private router: Router,
    private toastr: ToastrService
    ) {
      
    }
  // Get user funtions by user Id...
  GetUserFunctionsByUserId(id:number) {
    return this.httpClient.get<any[]>(this.baseUrl + `Login/GetUserFunctionsByUserId?id=${id}`,).pipe(
        map((menuHeading: any[]) => {
        this.menuHeading = menuHeading; 
        return menuHeading;
        }))   
}
  // Login
  Login(model : Array<string>) {
    console.log(this.baseUrl);
    //return this.httpClient.get<Login[]>('/app/_fake/fake_users.json');
    //return this.httpClient.get<Login[]>('/assets/fake_users.json');

    return this.httpClient.post<Login[]>(this.baseUrl + `Login/EmployeeLogin`,{
      username:model[0],
      password:model[1]
    }).pipe(
        map((loginDto: Login[]) => {
        this.loginDto = loginDto;
        return loginDto;
        }))   
  }

  logout(){
    this.router.navigateByUrl('/login')
    localStorage.removeItem('user');
  }
}
