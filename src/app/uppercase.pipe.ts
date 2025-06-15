import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase',
  standalone: false
})
export class UppercasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (typeof value !== 'string') {
      return ''; // Return an empty string or handle invalid values
    }
    return value.toUpperCase();
  }
}
