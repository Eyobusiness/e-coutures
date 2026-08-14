import { Component, input } from '@angular/core';

export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'overlay';
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoaderColor = 'primary' | 'secondary' | 'white' | 'dark';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.css',
  host: {
    'class': 'inline-block'
  }
})
export class LoaderComponent {
  type = input<LoaderType>('spinner');
  size = input<LoaderSize>('md');
  text = input<string | null>(null);
  color = input<LoaderColor>('primary');
  fullScreen = input<boolean>(false);
}
