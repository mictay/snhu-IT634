import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlightsRoutingModule } from './flights-routing.module';
import { SearchFlightsComponent } from './search/search-flights.component';
import { OffersFlightsComponent } from './offers/offers-flights.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    SearchFlightsComponent,
    OffersFlightsComponent
  ],
  imports: [
    CommonModule,
    FlightsRoutingModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    FormsModule
  ],
})
export class FlightsModule {}
