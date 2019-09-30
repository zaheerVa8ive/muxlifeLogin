import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoDblClick]'
})
export class PreventDoubleClickDirective {
  
  constructor() { }
  
  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.setAttribute('disabled', true);
    setTimeout(function(){ 
      event.srcElement.removeAttribute('disabled');
    }, 500);
  }

}