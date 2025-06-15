import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercase',
  standalone: false
})
export class LowercasePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) {
      return value;
    }
    return value.toLowerCase(); 
 }

}
