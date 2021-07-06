import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../core/service/session.service';
import { Flight, FlightsRequest, FlightsResponse } from "../../core/interfaces/flights";
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-offers-display',
  templateUrl: './offers-display.component.html',
  styleUrls: ['./offers-display.component.scss'],
})
export class OffersDisplayComponent implements OnInit, OnChanges{
  @Input() title:string;
  @Input() adults:string;
  @Input() children:string;
  @Input() datasource:Flight[];
  @Output() itemEvent = new EventEmitter<any>();

  distance:string;
  duration:string;
  displayedColumns: string[] = ['flight', 'departing', 'departs', 'arrives', 'price'];
  tableData:any[];

  /*****************************************************************************
   */
   constructor(private sessionService: SessionService) {
    console.log("OffersDisplayComponent:constructor", "called");
  }

  /*****************************************************************************
   */
   ngOnInit() {    
    console.log("OffersDisplayComponent:ngOnInit calls");
  }

  /*****************************************************************************
   */
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('OffersDisplayComponent:ngOnChanges() called', changes);

    if(changes && changes.datasource)
      this.onUpdate();

  }

  /*****************************************************************************
   */
  onUpdate() {
    console.log('OffersDisplayComponent:onUpdate() called', this.datasource);

    if(!this.datasource)
      return;
      
    const tempTableData = [];
    var i = 0;
    const interateData:Flight[] = this.datasource;

    for(let flight of interateData) {
      console.log("flight", flight);

      if(i === 0) {
        this.distance = flight.distance.toFixed(2) + ' miles';
        this.duration = flight.duration.toFixed(2) + ' hrs';
      }

      var departs = new Date(flight.departs);
      var arrives = new Date(flight.arrives);

      tempTableData.push(
        {
          "flight": flight.flight,
          "departing": this.sessionService.formatDateMMDDYYY( departs ),
          "departs": this.sessionService.toTime(departs),
          "arrives": this.sessionService.toTime(arrives),
          "price": '$' + (flight.total).toFixed(2),
        }
      );

    }

    this.tableData = tempTableData;

  }

  /*****************************************************************************
   */
  onSelectPrice(event) {
    console.log('OffersDisplayComponent:onSelectPrice() called', event);
    this.itemEvent.emit(event); //send this back to the parent
  }

}//end class
