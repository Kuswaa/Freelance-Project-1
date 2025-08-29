import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [ ReactiveFormsModule, CommonModule],
    templateUrl: './home.component.html',
    })

export class HomeComponent {
    searchForm: FormGroup;
    results: any[] = []; // will hold backend results

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

onSearch() {
    const formData = this.searchForm.value;
    let queryType = '';
    let queryValue = '';

    if (formData.firstName) {
        queryType = 'name';
        queryValue = formData.firstName;
    } else if (formData.lastName) {
        queryType = 'name';
        queryValue = formData.lastName;
    } else if (formData.middleName) {
        queryType = 'name';
        queryValue = formData.middleName;
    } else if (formData.idCardNumber) {
        queryType = 'id';
        queryValue = formData.idCardNumber;
    } else if (formData.phone) {
        queryType = 'phone';
        queryValue = formData.phone;
    } else if (formData.licensePlate) {
        queryType = 'plate';
        queryValue = formData.licensePlate;
    }

    if (!queryType || !queryValue) {
        console.warn('No query value entered');
        return;
    }

    console.log("Searching with:", { type: queryType, value: queryValue });

this.searchService.search({ type: queryType, value: queryValue }).subscribe(res => {
        console.log("Backend results:", res.results);
        this.searchService.setResults(res.results); // store results
        this.router.navigate(['/results']); // navigate to results page
    });
}

}
