import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  results: any[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      middleName: [''],
      licensePlate: [''],
      phone: [''],
      idCardName: [''],
      idCardNumber: [''],
      idCardType: [''],
      chassisNumber: [''],
      companyName: ['']
    });
  }

  ngOnInit() {
    console.log('🟢 HomeComponent initialized');

    // Subscribe to service observables
    this.subscription.add(
      this.searchService.results$.subscribe(r => {
        console.log('📦 Results updated in HomeComponent:', r);
        this.results = r;
      })
    );

    this.subscription.add(
      this.searchService.loading$.subscribe(l => {
        console.log('⏳ Loading updated in HomeComponent:', l);
        this.loading = l;
      })
    );
  }

  ngOnDestroy() {
    console.log('🛑 HomeComponent destroyed, unsubscribing');
    this.subscription.unsubscribe();
  }

  onSearch() {
    console.log('🔍 onSearch() triggered');
    console.log('Form values:', this.searchForm.value);

    const { firstName, lastName, idCardNumber, phone, licensePlate } = this.searchForm.value;

    let queryType = '';
    let queryValue = '';

    if (firstName) { queryType = 'name'; queryValue = firstName; }
    else if (lastName) { queryType = 'name'; queryValue = lastName; }
    else if (idCardNumber) { queryType = 'id'; queryValue = idCardNumber; }
    else if (phone) { queryType = 'phone'; queryValue = phone; }
    else if (licensePlate) { queryType = 'plate'; queryValue = licensePlate; }

    if (!queryType || !queryValue) {
      console.warn('⚠️ No query value entered');
      return;
    }

    console.log('📝 Resolved queryType:', queryType, '| queryValue:', queryValue);

    // Call the service
    this.searchService.search(queryType, queryValue);

    // Navigate to results page
    this.router.navigate(['/home/results']);
  }
}
