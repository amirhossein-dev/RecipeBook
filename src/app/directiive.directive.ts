import {
  Directive,
  HostListener,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appDirectiive]',
})
export class DirectiiveDirective implements OnInit {
  constructor(
    private temRef: TemplateRef<{ name: string; age: number }>,
    private viewRef: ViewContainerRef
  ) {}

  @HostListener('click') oaskdoaskd(event: Event) {
    console.log('hi');
  }

  ngOnInit(): void {
    this.viewRef.createEmbeddedView(this.temRef, { name: 'shahab', age: 600 });
  }
}
