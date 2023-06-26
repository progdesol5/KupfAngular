import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Login } from 'src/app/modules/models/login';
import { MenuHeading } from 'src/app/modules/models/MenuHeading';
import { UserFunctionDto } from 'src/app/modules/models/UserFunctions/UserFunctionDto';
import { CommonService } from 'src/app/modules/_services/common.service';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { LoginService } from 'src/app/modules/_services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

hasError: boolean;
returnUrl: string;
isLoading$: Observable<boolean>;

//
loginDto: Login[]=[];
// to put filtered user's data into localStorage
lg:Login;
// private fields
private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
loginForm: FormGroup;
closeResult = '';
model: any = {}
isSuccess:boolean=false;
locations:any[];
//
menuHeading: MenuHeading[]=[];

constructor(
  private fb: FormBuilder,
  private router: Router,
  private loginService: LoginService,
  private toastr: ToastrService,
  private OccupationService: DbCommonService,
  private modalService: NgbModal,
  private cd: ChangeDetectorRef,
  private commonService: CommonService
) {
  
}
selectedCar: number;
    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];
    
ngOnInit(): void {  
  this.initForm();
  this.isLoading$ = this.loginService.isLoading$;
}

initForm() {
  this.loginForm = this.fb.group({
    //username: prog1, password: Shakir
      tenentId: new FormControl('', Validators.required),
      useremail: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      locations:['']
  });
}
// To access username in .html file.
get useremail(){return this.loginForm.get('useremail')}
get tenentId(){return this.loginForm.get('tenentId')}

//If user has multiple locations so login to the selected location...
onLocationChange(e:any){
  if(e.target.value != 0){
    if(e.target.value=='-Select-'){
      this.toastr.error('Invalid Location')
    }else{ 
      // remove user if already exists...     
      localStorage.removeItem("user");
      // filter loging dto by selected location...
      this.lg = this.loginDto.find(ele => ele.locationId == e.target.value)!;
      this.loginDto = [];
      this.loginDto.push(this.lg);
      localStorage.setItem("user",JSON.stringify(this.loginDto));      
      this.router.navigateByUrl('/dashboard');
    }    
  }
}
ngOnDestroy() {
  this.unsubscribe.forEach((sb) => sb.unsubscribe());
}

// User Login
async login(form: any) {
  if(form.valid){
    await this.loginService.Login([this.loginForm.value.tenentId,this.loginForm.value.useremail,this.loginForm.value.password])
      .subscribe((response: Login[])=>{
      this.loginDto = response
      if(this.loginDto.length == 0){
        this.toastr.error('Invalid tenentId, useremail or password','Error');
        this.isSuccess = false;
        this.loginService.isLoading = false;
      }
      else if(this.loginDto.length == 1){ 
        this.toastr.success('Login Success','Success');       
        this.isSuccess = false;
        if(localStorage.getItem('user') != null){
          localStorage.removeItem("user");
          localStorage.setItem("user",JSON.stringify(this.loginDto));
        }else{
          localStorage.setItem("user",JSON.stringify(this.loginDto));
        }
        // TO get UserMenu Options by UserId...
        this.loginService.GetUserFunctionsByUserId(this.loginDto[0].userId).subscribe((response:any[])=>{
          this.menuHeading = response;   
           
          if(localStorage.getItem('userMenu') != null){
            localStorage.removeItem("userMenu");
            localStorage.setItem('userMenu',JSON.stringify(this.menuHeading));
            this.commonService.menuSessionUdpated.next({});
          }else{
           
            localStorage.setItem('userMenu',JSON.stringify(this.menuHeading));
            this.commonService.menuSessionUdpated.next({});
          }
          
        });
        this.router.navigateByUrl('/dashboard')      
      }
      else if(this.loginDto.length > 1){      
        this.toastr.success('Login Success','Success'); 
        this.router.navigateByUrl('/dashboard')   
        this.locations = this.loginDto;
        this.isSuccess = true;
        //this.cd.detectChanges();
      }
    })
  } else {
    Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());
  }
}

}