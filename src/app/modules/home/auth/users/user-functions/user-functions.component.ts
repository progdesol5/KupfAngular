import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectMasterIdDto } from 'src/app/modules/models/SelectMasterIdDto';
import { SelectUsersDto } from 'src/app/modules/models/SelectUsersDto';
import { UserFunctionDto } from 'src/app/modules/models/UserFunctions/UserFunctionDto';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { UserFunctionsService } from 'src/app/modules/_services/user-functions.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { FunctionForUserDto } from 'src/app/modules/models/FunctionForUserDto';

@Component({
  selector: 'app-user-functions',
  templateUrl: './user-functions.component.html',
  styleUrls: ['./user-functions.component.scss']
})
export class UserFunctionsComponent implements OnInit {
  //
  checkBox = true;
  SelectedMenuId: any = 1;
  //
  users$: Observable<SelectUsersDto[]>;
  //
  masterIds$: Observable<SelectMasterIdDto[]>;
  //
  userFunctions$: Observable<UserFunctionDto[]>;
  //
  allUserFunctions: UserFunctionDto[] = [];
  //
  moduleWiseMenuItems$: Observable<UserFunctionDto[]>;
  //
  moduleWiseMenuSubItems$: Observable<UserFunctionDto[]>;
  //
  selectedMenuItem: string;
  //
  lang: any = '';
  //
  checkData: any;

  // To get and put selected user info e.g. location Id, user id, role id etc.
  selectedUserInfo: SelectUsersDto;
  selectedUserMenu: any = [];
  userId: any;

  headerCheckboxForm: FormGroup;
  constructor(private dbCommonService: DbCommonService,
    private userFunctionService: UserFunctionsService,
    private toastr: ToastrService,
    private activatedRout: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.userId = this.activatedRout.snapshot.paramMap.get('id');
    this.createHeaderCheckboxForm();
  }

  createHeaderCheckboxForm() {
    this.headerCheckboxForm = this.fb.group({
      AdminFlg: [false],
      AddFlg: [false],
      EditFlg: [false],
      DelFlg: [false],
      PrintFlg: [false],
      EmptyFlg: [false],
      Sp1Flg: [false],
      Sp2Flg: [false],
      Sp3Flg: [false],
      Sp4Flg: [false],
      Sp5Flg: [false],
      ActiveFlg: [false]
    })
  }
  async ngOnInit(): Promise<void> {

    this.lang = localStorage.getItem('lang');
    // To display selected user...
    this.users$ = this.dbCommonService.GetUsers();
    //
    this.masterIds$ = this.dbCommonService.GetMasterId();
    let getCurrentUser: any = await this.dbCommonService.GetUsers().toPromise();
    this.selectedUserInfo = getCurrentUser.find((x: any) => x.userId == this.userId)!;
    this.onMenuItemSelect({ target: { value: this.SelectedMenuId } });
    this.moduleWiseMenuItems$ = this.userFunctionService.GetModuleWiseMenuItems();
  }


  mergeUserSelectedMenuData() {
    for (var val of this.selectedUserMenu) {
      let filterItem = this.checkData.filter((x: any) => x.fulL_NAME == val.fulL_NAME && x.menU_ID == val.menU_ID);
      if (filterItem.length > 0) {
        _.merge(filterItem[0], val);
      }
    }     
  }

  savedata() {
    //console.log(this.checkData);
    let saveSelectedMenu: any = [];

    this.checkData.forEach((element: any) => {
      //console.log(element);
      if (element.sP5 || element.sP4 || element.sP3 || element.sP2 || element.sP1 || element.addflage || element.delflage || element.editflage || element.printflage)  {
        saveSelectedMenu.push(element);
      }
    });    

    if (saveSelectedMenu.length > 0) {
      this.userFunctionService.AddFunctionForUser(saveSelectedMenu).subscribe(()=>{
        this.toastr.success('Saved Successfully')
      })
    }
    // create delete api by moduleid and user id -- Pending
  }

  async checkCheckBoxvalue(event: any, item: any) {
    let name = event.source.name;
    item[name] = item[name] ? 1 : 0;
  }
  //
  async checkAllCheckBoxvalue(event: any, colunmName: any) {
    let name = event.checked;
    this.checkData = this.checkData.map((e: any) => {
      return true ? { ...e, [colunmName]: event.checked == true ? 1 : 0 } : e;
    });
  }
  //
  async onMenuItemSelect(e: any) {
    console.log(this.checkData);
    this.checkData = await this.userFunctionService.GetAllFunctionUsers().toPromise();
    for (let user of this.checkData) {
      user.locatioN_ID = this.selectedUserInfo?.locationId;
      user.useR_ID = this.selectedUserInfo?.userId!;
      user.rolE_ID = 0;
      user.logiN_ID = this.selectedUserInfo?.loginId!;
      user.password = this.selectedUserInfo?.password!;
    }
    // Refill the existing Observable... 
    this.selectedUserMenu = await this.userFunctionService.GetFunctionUserByUserIdAsync(this.userId).toPromise();
    
    this.mergeUserSelectedMenuData();
    
    let filterData: any = this.checkData.filter((x: any) => x.modulE_ID == e.target.value);
    this.checkData = filterData;
    
    this.headerCheckboxForm.reset();
    this.refreshAsyncData();
     
  }

  refreshAsyncData() {
    this.cd.detectChanges();
  }
}



