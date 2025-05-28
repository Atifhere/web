// src/app/pipes/gst-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { toZonedTime, format } from 'date-fns-tz';

@Pipe({
  name: 'gstDate',
  standalone: true, // 👈 This is required for standalone usage
})
export class GSTDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const timeZone = 'Asia/Dubai';
    const zonedDate = toZonedTime(new Date(value), timeZone);
    return format(zonedDate, 'dd MMM yyyy, h:mm a', { timeZone });
  }
}
