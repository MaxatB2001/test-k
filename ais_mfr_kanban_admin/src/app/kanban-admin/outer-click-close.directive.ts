import { EventEmitter, OnDestroy } from '@angular/core';
import { Directive, Output, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[OuterClickClose]',
})
export class OuterClickCloseDirective implements OnInit, OnDestroy {
  constructor(private el: ElementRef) {}

  @Output() OuterClickClose = new EventEmitter<MouseEvent>();

  private listener = ($event: MouseEvent) => {
    const clickedInside = this.el.nativeElement.contains($event.target);

    if (!$event.target) {
      return;
    }
    if (!clickedInside) {
      console.log("outside");
      this.OuterClickClose.emit();
    } else {
      console.log("work")
      return;
    }
  };
  ngOnInit(): void {
    setTimeout(() => {
      document.addEventListener('click', this.listener);
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      document.removeEventListener('click', this.listener);
    });
  }
}
