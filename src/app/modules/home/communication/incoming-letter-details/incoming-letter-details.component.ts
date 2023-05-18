import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IncommingCommunicationDto } from 'src/app/modules/models/CommunicationDto';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { CommonService } from 'src/app/modules/_services/common.service';
import { CommunicationService } from 'src/app/modules/_services/communication.service';

@Component({
  selector: 'app-incoming-letter-details',
  templateUrl: './incoming-letter-details.component.html',
  styleUrls: ['./incoming-letter-details.component.scss']
})
export class IncomingLetterDetailsComponent implements OnInit {


  columnsToDisplay: string[] = ['action', 'letterdated', 'lettertype', 'filledat', 'searchtag', 'description'];

  incommingCommunicationDto$: Observable<IncommingCommunicationDto[]>;

  incommingCommunicationDto: MatTableDataSource<IncommingCommunicationDto> = new MatTableDataSource<any>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Sorting
  @ViewChild(MatSort) sort!: MatSort;

  isLoadingCompleted: boolean = false;

  // Incase of any error will display error message.
  dataLoadingStatus: string = '';

  // True of any error
  isError: boolean = false;

  // formGroup
  formGroup: FormGroup;

  // Search Term
  searchTerm: string = '';
  closeResult: string = '';
  // 
  formTitle: string;
  lang: any = '';
  
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

  constructor(private common: CommonService,
    private _communicationService: CommunicationService,
    private modalService: NgbModal,
    private toastrService: ToastrService) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang');


    this.formTitle = this.common.getFormTitle();
    this.formTitle = '';

    this.loadData();

    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'IncomingLetterDetails';

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
      console.log(this.formBodyLabels);
    }
    //#endregion
  }



  loadData() {
    this.incommingCommunicationDto$ = this._communicationService.GetIncomingLetters();
    this.incommingCommunicationDto$.subscribe((response: IncommingCommunicationDto[]) => {
      this.incommingCommunicationDto = new MatTableDataSource<IncommingCommunicationDto>(response);
      this.incommingCommunicationDto.paginator = this.paginator;
      this.incommingCommunicationDto.sort = this.sort;
      this.isLoadingCompleted = true;
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }


  filterRecords() {
    if (this.formGroup.value.searchTerm != null && this.incommingCommunicationDto) {
      this.incommingCommunicationDto.filter = this.formGroup.value.searchTerm.trim();
    }
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.filterRecords();
  }


  openDeleteModal(content: any, id: number) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        console.log(id);
        this._communicationService.DeleteIncomingLetter(id).subscribe(response => {
          if (response === 1) {
              this.toastrService.success('Record deleted successfully', 'Success');
            // Refresh Grid
            this.loadData();
          } else {
            this.toastrService.error('Something went wrong', 'Error');
          }
        });
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
