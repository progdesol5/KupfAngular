import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FunctionMst } from '../models/FunctionMst';

@Injectable({
  providedIn: 'root'
})
export class FunctionMstService {
// Getting base URL of Api from enviroment.
baseUrl = environment.KUPFApiUrl;
//
functionMst: FunctionMst[] = [];
constructor(private httpClient: HttpClient) { }


AddFunctionMst(response: FunctionMst) {    
  return this.httpClient.post(this.baseUrl +`FunctionMst/AddFunctionMst`,response);
}
DeleteFunctionMst(functionId: number) { 
  return this.httpClient.delete(`${this.baseUrl}FunctionMst/DeleteFunctionMst?id=${functionId}`);    
}
GetFunctionMstById(id:any) {    
 return this.httpClient.get<FunctionMst[]>(this.baseUrl +`FunctionMst/GetFunctionMstByIdAsync/${id}`).pipe(
    map(functionMst => {
      this.functionMst = functionMst;
      return functionMst;
    })
  )
}
getAllFunctionMst() {  
  //if (this.functionMst.length > 0) return of(this.functionMst);
  return this.httpClient.get<FunctionMst[]>(this.baseUrl +`FunctionMst/GetFunctionMst`).pipe(
    map(functionMst => {
      this.functionMst = functionMst;
      return functionMst;
    })
  )
}

}

