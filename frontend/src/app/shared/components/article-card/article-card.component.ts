import {Component, Input, OnInit} from '@angular/core';
import {ArticlePreviewType} from "../../../../types/article-preview.type";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article: ArticlePreviewType | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
