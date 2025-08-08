import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryToPartType'
})
export class CategoryToPartTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
