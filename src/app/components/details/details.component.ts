import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html'
})
export class DetailsComponent {
  person: any = null;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {
    const cedula = this.route.snapshot.paramMap.get('cedula');
    if (cedula) {
      this.person = this.searchService.getResultByCedula(cedula);
    }
  }
}
