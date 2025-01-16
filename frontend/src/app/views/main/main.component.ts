import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticlePreviewType} from "../../../types/article-preview.type";
import {ApplicationServiceType} from "../../../types/application-service.type";
import {ApplicationService} from "../../shared/services/application.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationServiceValuesType} from "../../../types/application-service-values.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  popularArticles: ArticlePreviewType[] = [];
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<ElementRef> | null = null;
  currentApplicationServiceValue: ApplicationServiceValuesType | null = null;
  applicationServiceValuesType = ApplicationServiceValuesType;

  offersCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  }

  reviewsCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 24,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  }

  applicationServices: ApplicationServiceType[] = this.applicationService.getApplicationServices();

  constructor(private articleService: ArticleService,
              private applicationService: ApplicationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe({
        next: (articles) => {
          this.popularArticles = articles;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      });
  }

  openDialog(applicationServiceValue: ApplicationServiceValuesType) {
    this.currentApplicationServiceValue = applicationServiceValue;
    this.dialogRef = this.dialog.open(this.popup);
  }

  closePopup() {
    this.dialogRef?.close();
  }
}
