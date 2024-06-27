import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {
  transform(text: string, searchText: string): string {
    if (!searchText) return text;

    const regex = new RegExp(`(${searchText})`, 'gi');
    return text.replace(regex, '<span style="background:red">$1</span>');
  }
}
