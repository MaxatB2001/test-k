import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getTaskColor',
  pure: true
})
export class GetTaskColorPipe implements PipeTransform {

  transform(coefficient: number | undefined,): unknown {
    var hue
    if (coefficient) {
       hue = ((1 - coefficient) * 120).toString(10);
    }
     return ["hsl(", hue, ",50%,50%)"].join("");
  }

}
