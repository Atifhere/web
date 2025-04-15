import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  email = 'atif@salonmanger.com';
  contactPerson = 'Atif';
  contactNumber = '+971-55-377 2347';
  address = 'Dubai, UAE';
  companyName = 'Salon Manager';
}
