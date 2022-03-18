import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from '@angular/core';
import JsBarcode from 'jsbarcode';

type BarcodeType =
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN'
  | 'UPC'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'CODE39'
  | 'ITF14'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar';

@Component({
  selector: 'ngx-codemobiles-barcode',
  template: `<div #bcElement [class]="cssClass"></div>`,
  styles: [],
})
export class NgxCodemobilesBarcodeComponent implements AfterViewInit, OnChanges {
  @ViewChild('bcElement') bcElement?: ElementRef;
  @Input('bc-element-type') elementType: 'svg' | 'img' | 'canvas' = 'svg';
  @Input('bc-class') cssClass = 'barcode'; // this should be done more elegantly
  @Input('bc-value') value = '';
  @Input('bc-format') format: BarcodeType = 'CODE128';
  @Input('bc-width') width = 2;
  @Input('bc-height') height = 100;
  @Input('bc-display-value') displayValue = true;
  @Input('bc-font-options') fontOptions = '';
  @Input('bc-font') font = 'monospace';
  @Input('bc-text-align') textAlign = 'center';
  @Input('bc-text-position') textPosition = 'bottom';
  @Input('bc-text-margin') textMargin = 2;
  @Input('bc-font-size') fontSize = 20;
  @Input('bc-background') background = '#ffffff';
  @Input('bc-line-color') lineColor = '#000000';
  @Input('bc-margin') margin = 10;
  @Input('bc-margin-top') marginTop?: number;
  @Input('bc-margin-bottom') marginBottom?: number;
  @Input('bc-margin-left') marginLeft?: number;
  @Input('bc-margin-right') marginRight?: number;
  @Input('bc-valid') valid: () => boolean = () => true;

  constructor(private renderer: Renderer2) {}

  get options() {
    return {
      format: this.format,
      width: this.width,
      height: this.height,
      displayValue: this.displayValue,
      fontOptions: this.fontOptions,
      font: this.font,
      textAlign: this.textAlign,
      textPosition: this.textPosition,
      textMargin: this.textMargin,
      fontSize: this.fontSize,
      background: this.background,
      lineColor: this.lineColor,
      margin: this.margin,
      marginTop: this.marginTop,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      valid: this.valid,
    };
  }

  ngOnChanges(): void {
    this.generateBarcode();
  }

  ngAfterViewInit(): void {
    this.generateBarcode();
  }

  generateBarcode() {
    if (!this.bcElement || !this.value) return;

    let element: Element;
    switch (this.elementType) {
      case 'img':
        element = this.renderer.createElement('img');
        break;
      case 'canvas':
        element = this.renderer.createElement('canvas');
        break;
      case 'svg':
      default:
        element = this.renderer.createElement('svg', 'svg');
    }

    JsBarcode(element, this.value, this.options);

    for (let node of this.bcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.bcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.bcElement.nativeElement, element);
  }
}

