import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  cedula!: string;
  url!: string;
  details: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Get cedula from route
    this.cedula = this.route.snapshot.paramMap.get('cedula')!;
    console.log('🟢 DetailsComponent initialized with cedula:', this.cedula);

    // 2️⃣ Find the original search result to get the link
    const result = this.searchService.getResultByCedula(this.cedula);
    if (!result || !result.link) {
      console.error('⚠️ Result or URL missing for cedula:', this.cedula);
      return;
    }

    this.url = result.link; // ✅ Use exactly what was stored
    console.log('🔗 Using URL for details fetch:', this.url);

    // 3️⃣ Fetch details from backend
    this.fetchDetails();
  }

  fetchDetails(): void {
    this.loading = true;
    console.log('⏳ Starting fetchDetails...');

    this.api.getDetails(this.cedula).subscribe({
      next: (res) => {
        console.log('✅ Details fetched successfully:', res);

        // 4️⃣ Normalize missing fields
        this.details = {
          name: res.name || 'N/A',
          cedula: res.cedula || 'N/A',
          image: res.image || 'assets/default-avatar.png',
          generales: res.generales || {},
          telefonos: res.telefonos || []
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch details:', err);
        this.details = {
          name: 'N/A',
          cedula: this.cedula,
          image: 'assets/default-avatar.png',
          generales: {},
          telefonos: []
        };
        this.loading = false;
      }
    });
  }
}
