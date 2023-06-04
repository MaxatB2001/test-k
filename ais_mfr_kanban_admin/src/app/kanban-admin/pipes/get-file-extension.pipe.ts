import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFileExtension',
  pure: true
})
export class GetFileExtensionPipe implements PipeTransform {
  transform(fileName: string): string {
    const fileExtension = fileName.split('.').pop();
    if (
      fileExtension == 'jpeg' ||
      fileExtension == 'jpg' ||
      fileExtension == 'png'
    )
      return 'image';
      return 'insert_drive_file';
  }
}
