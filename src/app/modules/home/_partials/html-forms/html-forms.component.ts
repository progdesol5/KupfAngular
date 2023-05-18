import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from 'src/app/modules/_services/common.service';
@Component({
  selector: 'app-html-forms',
  templateUrl: './html-forms.component.html',
  styleUrls: ['./html-forms.component.scss']
})
export class HtmlFormsComponent implements OnInit {
  @Input() accordialHTMLForms: string;
 
  englishHTML: any = '';
  arabicHtml: any = '';
  
  @Input() parentFormGroup:FormGroup;
  editorForm: FormGroup;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    //toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  electricform1:any;
  electricform2:any;
  attachment1: File;
  attachment2: File;
  constructor(private commonService: CommonService) { }
 

  ngOnInit(): void { 
    this.initializeEditorForm();
    if (this.parentFormGroup) {
      this.parentFormGroup.setControl('editorForm', this.editorForm);
    }    
  }

  initializeEditorForm() {
    this.editorForm = new FormGroup({
      englishHtml: new FormControl('', Validators.required),
      arabicHtml: new FormControl('', Validators.required),
      englishWebPageName: new FormControl('', Validators.required),
      arabicWebPageName: new FormControl('', Validators.required),
      // electronicForm1: new FormControl('', Validators.required),
      electronicForm1URL: new FormControl('', Validators.required),
      // electronicForm2: new FormControl('', Validators.required),
      electronicForm2URL: new FormControl('', Validators.required),
      webEnglish: new FormControl('', Validators.required),
      webArabic: new FormControl('', Validators.required),
      isElectronicForm:new FormControl(true)
    })
    
  }
  get editorformVal(){
    console.log(this.editorForm.controls);
    return this.editorForm.controls
  }
  //
  
  // 
  onElectronicForm1Select(event: any) {    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.attachment1 = file;
      this.electricform1 = file.name;      
      this.commonService.attachment1 = this.attachment1;
      
    }
  }
  onElectronicForm2Select(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachment2 = file;
      this.electricform2 = file.name;      
      this.commonService.attachment2 = this.attachment2;
    }
  }
}
