import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserFunctionDto } from '../models/UserFunctions/UserFunctionDto';
import { UserMstDto } from '../models/UserMst.ts/UserMstDto';

@Injectable({
  providedIn: 'root'
})
export class UserMstService {

  // Getting base URL of Api from enviroment.
baseUrl = environment.KUPFApiUrl;
//

userMst: UserMstDto[]=[];
  he: any;
constructor(private httpClient: HttpClient) { }

// add user mst
AddUserMST(response: UserMstDto) {    
  return this.httpClient.post(this.baseUrl +`UserMst/AddUserMst`,response);
}

// Update user mst
UpdateUserMST(data: UserMstDto){
  return this.httpClient
    .put(this.baseUrl + "UserMst/UpdateUserMst", data)
    .pipe(map(res =>{
      return res;
    }))
    .toPromise();
}

//
DeleteUserMST(userId: number) { 
  return this.httpClient.delete(`${this.baseUrl}UserMst/DeleteUserMst?userId=${userId}`);    
}

//
GetUserMstById(id:any) {    
  return this.httpClient.get<UserMstDto[]>(this.baseUrl +`UserMst/GetUserMstById/${id}`).pipe(
    map(userMst => {
      this.userMst = userMst;
      return userMst;
    })
  )
}



// Update user password
UpdateUserPassword(data: UserMstDto){
  return this.httpClient
    .put(this.baseUrl + "UserMst/UpatePassword", data)
    .pipe(map(res =>{
      return res;
    }))
    .toPromise();
}

  // Get all user User Mst
  GetUsersFromUserMst() {     
    return this.httpClient.get<UserMstDto[]>(this.baseUrl +`UserMst/GetUserMst`).pipe(
      map(userMst => {
        this.userMst = userMst;
        return userMst;
      })
    )
  }
}
