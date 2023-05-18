
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CountriesDto } from 'src/app/modules/models/CountriesDto';
import { DetailedEmployee } from 'src/app/modules/models/DetailedEmployee';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { SelectDepartmentsDto } from 'src/app/modules/models/SelectDepartmentsDto';
import { SelectOccupationsDto } from 'src/app/modules/models/SelectOccupationsDto';
import { SelectTerminationsDto } from 'src/app/modules/models/SelectTerminationsDto';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { EmployeeService } from 'src/app/modules/_services/employee.service';

@Component({
  selector: 'app-addemployeeinformation',
  templateUrl: './addemployeeinformation.component.html',
  styleUrls: ['./addemployeeinformation.component.scss'],

})
export class AddemployeeinformationComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  //
  parentForm: FormGroup;
  addEmployeeForm: FormGroup;
  //
  jobDetailsForm: FormGroup;
  //
  membershipForm: FormGroup;
  //
  isChildFormSet = false;
  showChildComponent = false;
  //
  //
  isFormSubmitted = false;
  occupations$: Observable<SelectOccupationsDto[]>;
  departments$: Observable<SelectDepartmentsDto[]>;
  terminations$: Observable<SelectTerminationsDto[]>;
  countries$: Observable<CountriesDto[]>;
  //
  contractType$: Observable<SelectOccupationsDto[]>;
  //
  editEmployeeInformation$: Observable<DetailedEmployee[]>;
  employeeId: any;
  //#region 
  /*----------------------------------------------------*/

  // Language Type e.g. 1 = ENGLISH and 2 =  ARABIC
  languageType: any;

  // Selected Language
  language: any;

  // We will get form lables from lcale storage and will put into array.
  AppFormLabels: FormTitleHd[] = [];

  // We will filter form header labels array
  formHeaderLabels: any[] = [];

  // We will filter form body labels array
  formBodyLabels: any[] = [];

  // FormId
  formId: string;

  /*----------------------------------------------------*/
  //#endregion
  datePickerConfig: Partial<BsDatepickerConfig> | undefined;
  selectedStatus: number | undefined;
  maritalStatusArray: any = [
    { id: 1, name: 'Married' },
    { id: 2, name: 'Single' }
  ];
  selectedGender: number | undefined;
  genderArray: any = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];
  // 
  @ViewChild('popupModal', { static: true }) popupModal: ElementRef;
  //
  popUpForm: FormGroup;
  closeResult: string = '';
  isOK: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService,
    private toastrService: ToastrService,
    private commonDbService: DbCommonService,
    private fb: FormBuilder,
    private activatedRout: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) {

    this.datePickerConfig = Object.assign({}, { containerClass: 'theme-dark-blue' })
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.setUpParentForm();
    //
    this.employeeId = this.activatedRout.snapshot.paramMap.get('employeeId');

    this.countries$ = this.commonDbService.GetCountryList();
  }

  selectedOccupation: number | undefined;
  ngOnInit(): void {
    this.initializeForm();
    //
    this.initializeJobDetailsForm();
    //
    this.initializeMembershipForm();
    //
    this.initPopUpModal();
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'AddEmployee';

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId && labels.language == this.languageType) {

          this.formHeaderLabels.push(labels);

          this.formBodyLabels.push(labels.formTitleDTLanguage);

        }
      }
    }
    //#endregion

    //#region Filling All dropDown from db    
    // To FillUp Occupations
    this.occupations$ = this.commonDbService.GetOccupations();
    // To FillUp Departments
    this.departments$ = this.commonDbService.GetDepartments();
    // To FillUp terminations
    this.terminations$ = this.commonDbService.GetTerminations();
    // To FillUp Contract Types
    this.contractType$ = this.commonDbService.GetContractType();
    //#endregion
    // Get and fill data in Edit Mode...
    if (this.employeeId != null) {
      this.isOK = true;
      this.editEmployeeInformation$ = this.employeeService.GetEmployeeById(this.employeeId);
      this.editEmployeeInformation$.subscribe((response: any) => {

        this.parentForm.patchValue({
          addEmployeeForm: {
            employeeId: response.employeeId,
            englishName: response.englishName,
            arabicName: response.arabicName,
            empBirthday: response.empBirthday ? new Date(response.empBirthday) : '',
            empGender: response.empGender,
            empMaritalStatus: +response.empMaritalStatus,
            mobileNumber: response.mobileNumber,
            empWorkTelephone: response.empWorkTelephone,
            empWorkEmail: response.empWorkEmail,
            next2KinName: response.next2KinName,
            next2KinMobNumber: response.next2KinMobNumber,
            isKUEmployee: response.isKUEmployee,
            isMemberOfFund: response.isMemberOfFund,
            isOnSickLeave: response.isOnSickLeave,
            nationCode: response.nationCode,
            joinedDate: response.joinedDate ? new Date(response.joinedDate) : '',
          },
          jobDetailsForm: {
            department: response.department,
            departmentName: +response.departmentName,
            salary: response.salary,
            empCidNum: response.empCidNum,
            empPaciNum: response.empPaciNum,
            empOtherId: response.empOtherId,
            contractType: +response.contractType
          },
          membershipForm: {
            membership: response.membership,
            membershipJoiningDate: response.membershipJoiningDate ? new Date(response.membershipJoiningDate) : '',
            termination: +response.termination,
            terminationDate: response.terminationDate ? new Date(response.terminationDate) : '',
          },
          financialForm: {
            loanAct: response.loanAct,
            hajjAct: response.hajjAct,
            persLoanAct: response.persLoanAct,
            consumerLoanAct: response.consumerLoanAct,
            otherAct1: response.otherAct1,
            otherAct2: response.otherAct2,
            otherAct3: response.otherAct3,
            otherAct4: response.otherAct4,
            otherAct5: response.otherAct5
          }
        })
      })
    }

    this.membershipForm.get('termination')?.disable();
  }

  initializeForm() {
    this.addEmployeeForm = this.fb.group({
      employeeId: new FormControl('', Validators.required),
      englishName: new FormControl('', Validators.required),
      arabicName: new FormControl('', Validators.required),
      empBirthday: new FormControl('', Validators.required),
      empGender: new FormControl('', Validators.required),
      empMaritalStatus: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      empWorkTelephone: new FormControl(''),
      empWorkEmail: new FormControl('', Validators.required),
      next2KinName: new FormControl(''),
      next2KinMobNumber: new FormControl(''),
      isKUEmployee: new FormControl('true'),
      isOnSickLeave: new FormControl(''),
      isMemberOfFund: new FormControl(''),
      nationCode: new FormControl('', Validators.required),
      nationName: new FormControl(''),
      joinedDate: new FormControl('', Validators.required),
    })
    this.parentForm.setControl('addEmployeeForm', this.addEmployeeForm);
  }
  initializeJobDetailsForm() {
    this.jobDetailsForm = this.fb.group({
      department: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
      salary: new FormControl(''),
      empCidNum: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      empPaciNum: new FormControl(''),
      empOtherId: new FormControl(''),
      contractType: new FormControl('', Validators.required)
    })
    this.parentForm.setControl('jobDetailsForm', this.jobDetailsForm);
  }
  initializeMembershipForm() {
    this.membershipForm = this.fb.group({
      membership: new FormControl('', Validators.required),
      membershipJoiningDate: new FormControl('', Validators.required),
      termination: new FormControl('', Validators.required),
      terminationDate: new FormControl('', Validators.required),
    })
    this.parentForm.setControl('membershipForm', this.membershipForm);
  }
  initPopUpModal() {
    this.popUpForm = this.fb.group({
      errorMessage: new FormControl(null)
    })
  }
  setUpParentForm() {
    this.parentForm = this.fb.group({});
  }
  //get gender(){return this.addEmployeeForm.get('gender')}


  //Save employee data...
  submitForm() {

    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
    const username = data.map((obj: { username: any; }) => obj.username);
    const userId = data.map((obj: { userId: any; }) => obj.userId);

    let empId = this.addEmployeeForm.get('employeeId')?.value
    this.parentForm.controls.addEmployeeForm.patchValue({
      empGender: +this.parentForm.value.addEmployeeForm.empGender,
      empMaritalStatus: +this.parentForm.value.addEmployeeForm.empMaritalStatus,
      employeeId: +empId,
    });
    //  TO CONVER OBJECT ARRAY AS SIMPLE ARRAY.
    let formData = {
      ...this.parentForm.value.addEmployeeForm,
      ...this.parentForm.value.jobDetailsForm,
      ...this.parentForm.value.membershipForm,
      ...this.parentForm.value.financialForm,
      tenentID: tenantId[0],
      locationId: locationId[0],
      username: username[0],
      userId: userId[0]
    }
    //
    this.isFormSubmitted = true;
    //
    if (this.addEmployeeForm.valid) {
      if (this.employeeId != null) {
        this.employeeService.UpdateEmployee(formData).subscribe((res: any) => {
          console.log(res);
          this.toastrService.success('Saved successfully', 'Success');
          this.addEmployeeForm.reset();
          this.jobDetailsForm.reset();
          this.membershipForm.reset();
          this.parentForm.reset();
          this.router.navigateByUrl('/employee/view-employee')
        }, error => {
          if (error.status === 500) {
            this.toastrService.error('Something went wrong', 'Error');
          }
        })
      }
      else {
        this.employeeService.ValidateEmployeeData(formData).subscribe((response: any) => {
          if (response == "1") {
            this.toastrService.error('Duplicate Civil Id, please enter a different Civil Id', 'Error');
          }
          else if (response == "2") {
            this.popUpForm.patchValue({
              errorMessage: '?Duplicate mobile number found, do you want to proceed'
            })
            this.openPopUpModal(this.popupModal, formData);
          }
          else if (response == "3") {
            this.popUpForm.patchValue({
              errorMessage: '?Duplicate email found, do you want to proceed'
            })
            this.openPopUpModal(this.popupModal, formData);
          }
          else if (response == "4") {
            this.toastrService.error('Duplicate Employee Id, please enter a different Employee Id', 'Error');
          }
          else if (response == "0") {
            this.employeeService.AddEmployee(formData).subscribe((res: any) => {
              console.log(res)
              this.toastrService.success('Saved successfully', 'Success');
              this.addEmployeeForm.reset();
              this.jobDetailsForm.reset();
              this.membershipForm.reset();
              this.parentForm.reset();
              this.addEmployeeForm.controls['employeeId'].setValue(0);
              this.router.navigateByUrl('/employee/view-employee')
            })
          }
        });
      }
    }
  }
  //
  get empForm() { return this.addEmployeeForm.controls; }
  get jobForm() { return this.jobDetailsForm.controls; }
  //
  addChildComponent(): void {
    this.showChildComponent = true;
  }
  onCountryChange(event: any) {
    console.log(event);
    this.addEmployeeForm.controls['nationName'].setValue(event.counamE1);
  }
  onChange(form: FormGroup<any>) {
    // reset the form value to the newly emitted form group value.
    this.addEmployeeForm = form;
  }
  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  //#region Delete operation and Modal Config
  openPopUpModal(content: any, formData: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.employeeService.AddEmployee(formData).subscribe((response: any) => {
          this.toastrService.success('Saved successfully', 'Success');
          this.parentForm.reset();
        })
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
