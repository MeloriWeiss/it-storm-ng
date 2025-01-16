import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../../../environments/environment";

@Pipe({
  standalone: true,
  name: 'serverImageUrl'
})
export class ServerImageUrlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null;
    return environment.serverStaticPath + value;
  }

}
