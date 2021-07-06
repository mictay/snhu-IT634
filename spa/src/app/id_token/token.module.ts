import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TokenComponent } from './token.component';
import { TokenRoutingModule } from './token-routing.module';
import { MatTableModule } from '@angular/material/table';
@NgModule({
  declarations: [
    TokenComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    RouterModule,
    TokenRoutingModule,
    MatTableModule
  ]
})
export class TokenModule {}
