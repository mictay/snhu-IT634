import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFlightsComponent } from './search/search-flights.component';
import { OffersFlightsComponent } from './offers/offers-flights.component';
const routes: Routes = [
  {
    path: '',
    component: SearchFlightsComponent
  },
  {
    path: 'offers',
    component: OffersFlightsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightsRoutingModule { }
