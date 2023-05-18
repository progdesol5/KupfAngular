import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Observable } from 'rxjs/internal/Observable';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { LocalizationService } from 'src/app/modules/_services/localization.service';

@Component({
  selector: 'app-manage-form-labels',
  templateUrl: './manage-form-labels.component.html',
  styleUrls: ['./manage-form-labels.component.scss']
})
export class ManageFormLabelsComponent implements OnInit {

  /* Material Table Configuration */
  
  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'formID', 'formName', 'headerName', 'subHeaderName'];

  // Getting data as abservable.
  formTitleHd$: Observable<FormTitleHd[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  formTitleHd: MatTableDataSource<FormTitleHd> = new MatTableDataSource<any>([]);

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
  //#endregion



  constructor(private localizationService: LocalizationService) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl(null)
    })
  }

  ngOnInit(): void {
    //#region    
    this.formTitleHd$ = this.localizationService.getAllFormHeaderLabels();
    this.formTitleHd$.subscribe((resoponse: FormTitleHd[]) => {
      this.formTitleHd = new MatTableDataSource<FormTitleHd>(resoponse);
      this.formTitleHd.paginator = this.paginator;
      this.formTitleHd.sort = this.sort;
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
  filterRecords() {
    if (this.formGroup.value.searchTerm != null && this.formTitleHd) {
      this.formTitleHd.filter = this.formGroup.value.searchTerm.trim();
    }
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.filterRecords();
  }
  //#endregion


}
function next(next: any, arg1: (resoponse: FormTitleHd[]) => void, arg2: (error: any) => void) {
  throw new Error('Function not implemented.');
}

