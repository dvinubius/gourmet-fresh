import { Directive,
          ElementRef,
          OnInit,
          HostListener,
          HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
  stateDropped = false;

  constructor(private elRef: ElementRef) { }

  @HostBinding('class.open') isOpen = false;
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    // assuming that the dropdown is not open when component loads.
    // we could check here and initialize the this.stateDropped accordingly, though
  }
}
