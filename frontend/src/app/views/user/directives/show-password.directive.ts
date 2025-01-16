import {Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[showPassword]'
})
export class ShowPasswordDirective implements OnChanges {

  @Input() showPassword: boolean = false;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.showPassword) {
      this.renderer2.setAttribute(this.elementRef.nativeElement, 'type', 'text');
    } else {
      this.renderer2.setAttribute(this.elementRef.nativeElement, 'type', 'password');
    }
  }

}
