import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ApplicationServiceValuesType} from "../../../../types/application-service-values.type";
import {ApplicationService} from "../../services/application.service";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {RequestTypes} from "../../../../types/request-types";
import {RequestDataType} from "../../../../types/request-data.type";
import {HttpErrorResponse} from "@angular/common/http";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import IMask from "imask";

@Component({
  selector: 'application-popup-content',
  templateUrl: './application-popup-content.component.html',
  styleUrls: ['./application-popup-content.component.scss']
})
export class ApplicationPopupContentComponent implements OnInit, AfterViewInit {

  @Input() isServiceType: boolean = false;
  @Input() serviceValue: ApplicationServiceValuesType | null = null;
  applicationServiceOptions: { title: string, value: ApplicationServiceValuesType }[] | null = null;
  title: string = '';
  buttonText: string = '';
  @Output() popupClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  applicationSent: boolean = false;
  @ViewChild('phoneInput') phoneInput!: ElementRef;

  applicationForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern('^\\s*([А-ЯЁ][а-яё]+[\\-\\s]?){1,3}\\s*$')]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)\\s*[\\- ]?)?\\s*(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{10}$')]],
  });

  constructor(private applicationService: ApplicationService,
              private requestService: RequestService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.isServiceType) {
      this.title = 'Заявка на услугу';
      this.buttonText = 'Оставить заявку';

      this.applicationServiceOptions = this.applicationService.getApplicationServices()
        .map(item => ({
          title: item.title,
          value: item.value
        }));

      this.applicationForm.get('service')?.setValidators(Validators.required);

      if (!this.serviceValue) {
        this.serviceValue = this.applicationServiceOptions[0].value;
      }
      this.applicationForm.patchValue({service: this.serviceValue});
    } else {
      this.title = 'Закажите бесплатную консультацию!'
      this.buttonText = 'Заказать консультацию';
    }
  }

  ngAfterViewInit() {
    const phoneMask = IMask(this.phoneInput.nativeElement, {
      mask: '+{7} (000) 000-00-00'
    });
  }


  get service() {
    return this.applicationForm.get('service');
  }
  get name() {
    return this.applicationForm.get('name');
  }
  get phone() {
    return this.applicationForm.get('phone');
  }

  sendApplication(event: Event) {
    event.preventDefault();
    if (this.applicationForm.valid) {
      const type: RequestTypes = this.isServiceType ? RequestTypes.order : RequestTypes.consultation;
      const requestData: RequestDataType = {
        name: this.applicationForm.value.name!,
        phone: this.applicationForm.value.phone!,
        type: type
      };
      if (this.isServiceType && this.applicationForm.value.service) {
        requestData.service = this.applicationForm.value.service;
      }

      this.requestService.createRequest(requestData)
        .subscribe({
          next: (result: DefaultResponseType) => {
            if (result.error) {
              this._snackBar.open('Не удалось отправить заявку. Попробуйте ещё раз');
              throw new Error(result.message);
            }
            this.applicationSent = true;
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open('Не удалось отправить заявку. Попробуйте ещё раз');
            throw new Error(error.error.message);
          }
        });
    }
  }

  closePopup() {
    this.popupClosed.emit(true);
  }
}
