import {Component, HostListener, OnInit} from '@angular/core';
import {ArticlePreviewType} from "../../../../types/article-preview.type";
import {ArticleService} from "../../../shared/services/article.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FilterItemType} from "../../../../types/filter-item.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ArticlesType} from "../../../../types/articles.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlePreviewType[] = [];
  openFilter: boolean = false;
  paginationNumbers: number[] = [];
  visiblePaginationNumbers: number[] = [];
  totalPages: number = 1;
  page: number = 1;
  categories: FilterItemType[] = [];
  fetchingArticles: boolean = true;

  currentFilterItems: FilterItemType[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe({
        next: (categories: FilterItemType[]) => {
          this.categories = categories;
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open('Не удалось загрузить фильтры');
        }
      });

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(700)
      )
      .subscribe((params: Params) => {
        if (params['categories']) {
          this.currentFilterItems = [];
          const categoriesUrls = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
          categoriesUrls.forEach(url => {
            const category = this.categories.find(item => item.url == url);
            if (category) {
              category.active = true;
              this.currentFilterItems.push(category);
            }
          });
        }
        if (params['page']) {
          this.page = +params['page'];
        }
        this.articleService.getArticles(this.page, this.currentFilterItems.map(category => category.url))
          .subscribe({
            next: (articles) => {
              this.articles = articles.items;
              this.totalPages = articles.pages;
              this.calculatePagination(articles);
              this.fetchingArticles = false;
            },
            error: (error: HttpErrorResponse) => {
              this._snackBar.open('Не удалось загрузить статьи');
              this.fetchingArticles = false;
            }
          });
      });
  }

  calculatePagination(articles: ArticlesType) {
    this.paginationNumbers = [];
    if (articles.pages > 1) {
      for (let page = 1; page <= articles.pages; page++) {
        this.paginationNumbers.push(page);
      }
    }
    this.visiblePaginationNumbers = this.calculateVisiblePaginationNumbers();
  }

  toggleFilter() {
    this.openFilter = !this.openFilter;
  }

  changeFilterItems(filterItem: FilterItemType) {
    filterItem.active = !filterItem.active;
    if (filterItem.active) {
      this.currentFilterItems.push(filterItem);
    } else {
      this.currentFilterItems = this.currentFilterItems.filter(category => category.url !== filterItem.url);
    }
    this.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: {
        categories: this.currentFilterItems.map(category => category.url)
      }
    }).then();
  }

  @HostListener('document:click', ['$event'])
  defaultClick(event: MouseEvent) {
    let className = (event.target as HTMLElement).className;
    if (typeof className !== "object") {
      if (className.indexOf('blog-filter-select')) {
        if (this.openFilter) {
          this.openFilter = false;
        }
      }
    }
  }

  changePage(pageNumber: number) {
    if (pageNumber !== 0) {
      this.page = pageNumber;
      this.visiblePaginationNumbers = this.calculateVisiblePaginationNumbers();
      this.router.navigate(['/blog'], {
        queryParams: {
          page: this.page,
          categories: this.currentFilterItems.map(category => category.url)
        }
      }).then();
    }
  }

  prevPage() {
    this.changePage(this.page - 1);
  }
  nextPage() {
    this.changePage(this.page + 1);
  }

  calculateVisiblePaginationNumbers() {
    if (this.page === 1) {
      if (this.paginationNumbers.length > 4) {
        return [...this.paginationNumbers.slice(0, 3), 0, this.paginationNumbers[this.paginationNumbers.length - 1]];
      }
      return this.paginationNumbers.slice(0, 3);
    } else {
      if (this.page === this.paginationNumbers.length) {
        if (this.paginationNumbers.length > 4) {
          return [1, 0, ...this.paginationNumbers.slice(-3, this.paginationNumbers.length + 1)];
        }
        return this.paginationNumbers.slice(-3, this.paginationNumbers.length + 1);
      }
      return [1, 0, this.page, 0, this.paginationNumbers.length];
    }
  }
}
