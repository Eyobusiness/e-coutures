import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Footer
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  layoutService = inject(LayoutService);
}