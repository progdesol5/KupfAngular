import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormTitleDt } from 'src/app/modules/models/formTitleDt';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { LocalizationService } from 'src/app/modules/_services/localization.service';

@Component({
  selector: 'app-update-form-labels',
  templateUrl: './update-form-labels.component.html',
  styleUrls: ['./update-form-labels.component.scss']
})
export class UpdateFormLabelsComponent implements OnInit {
  
  /* Material Table Configuration */
  //#region
  // To display table column headers
  headerColumnsToDisplay: string[] = ['id', 'headerName','subHeaderName','action'];
  bodyColumnsToDisplay: string[] = ['id', 'title', 'arabicTitle','action2'];
  // Getting data as abservable.
  formTitleHd$: Observable<FormTitleHd[]>;
  formTitleDt$: Observable<FormTitleDt[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  formTitleHd: MatTableDataSource<FormTitleHd> = new MatTableDataSource<any>([]);
  formTitleDt: MatTableDataSource<FormTitleDt> = new MatTableDataSource<any>([]);

  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Sorting
  @ViewChild(MatSort) sort!: MatSort;

  // Hide footer while loading.
  isLoadingCompleted: boolean = false;

  // Incase of any error will display error message.
  dataLoadingStatus: string = '';

  // True of any error
  isError: boolean = false;

  // formGroup
  formGroup: FormGroup;

  // Search Term
  searchTerm: string = '';

  searchText:string = '';
  //#endregion

  refreshFormTitleHd$ = new BehaviorSubject<boolean>(true);

  constructor(private activatedRouter: ActivatedRoute, 
    private localizationService: LocalizationService, 
    private toastrService:ToastrService,private router: Router) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl(null)
    })
  }

  ngOnInit(): void {
    //#region    
    this.formTitleHd$ = this.localizationService.GetFormHeaderLabelsByFormId(this.activatedRouter.snapshot.params.formID);
    this.formTitleHd$.subscribe((resoponse: FormTitleHd[]) => {
      this.formTitleHd = new MatTableDataSource<FormTitleHd>(resoponse);
      this.isLoadingCompleted = true;
    }, error => {
      // Incase of any error
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })

    this.formTitleDt$ = this.localizationService.GetFormBodyLabelsByFormId(this.activatedRouter.snapshot.params.formID);
    this.formTitleDt$.subscribe((resoponse: FormTitleDt[]) => {
      this.formTitleDt = new MatTableDataSource<FormTitleDt>(resoponse);
      this.formTitleDt.paginator = this.paginator;
      this.formTitleDt.sort = this.sort;
      this.isLoadingCompleted = true;
    }, error => {
      // Incase of any error
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
    //#endregion  
  }


  //#region Material Search and Clear Filter
  filterRecords(event: any) {
    if (event.target.value != null && this.formTitleDt) {
      this.formTitleDt.filter = event.target.value.trim();
    }
  }
  clearFilter() {    
    this.formTitleDt.filter = "";    
  }
  backSpaceEvent(event: any){
      if (event.target.value != null && this.formTitleDt) {
      this.formTitleDt.filter = event.target.value.trim();
    }
  }
 
  //#endregion

  // If user want to edit header labels
  onHeaderEditClick(item: any) {
    // 
    this.formTitleHd.data.forEach(element => {
      element.isHeaderEdit = false;
    })
    item.isHeaderEdit = true;
  }

  // If user want to update header labels
  onHeaderUpdateClick(item: FormTitleHd) {
      this.localizationService.UpdateFormHeaderLabelsId(item).subscribe(()=>{
      this.toastrService.success('Updated Successfully','Success');      
    })    
    item.isHeaderEdit = false;
  }

  // If user want to edit body labels
  onBodyEditClick(item: any) {
    // 
    this.formTitleDt.data.forEach(element => {
      element.isBodyEdit = false;
    })
    item.isBodyEdit = true;
  }

  // If user want to update body labels
  onBodyUpdateClick(formBodyLabel: FormTitleDt) {    
      this.localizationService.UpdateFormBodyLabelsId(formBodyLabel).subscribe(()=>{
      this.toastrService.success('Updated Successfully','Success');      
    })    
    formBodyLabel.isBodyEdit = false;
  }

  // If user wants to cancel edit mode.
  refreshPage(){
    // // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);    
  }
 
  
}
