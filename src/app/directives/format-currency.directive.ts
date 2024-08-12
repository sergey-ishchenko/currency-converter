import { Directive, ElementRef, HostListener, forwardRef, Renderer2 } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[format-currency]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FormatCurrencyDirective),
        multi: true
    }]
})
export class FormatCurrencyDirective implements ControlValueAccessor {

    value = '';
    private onChange!: (val: string) => void;
    private onTouched!: () => void;

    constructor(
        private elementRef: ElementRef,
        private decimalPipe: DecimalPipe,
        private renderer: Renderer2
    ) {
        this.value = elementRef.nativeElement.value;
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
        if (value === '')
            return
        this.formatValue(value, true);
    }

    private formatValue(value: string, propagateChange: boolean) {
        let cleanedValue = value
            .replace(/[,]/g, '.')
            .replace(/[^0-9.]*/g, '');

        let transformedValue = this.transformValue(cleanedValue);

        // this.elementRef.nativeElement.value = transformedValue;
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', transformedValue);
        if (propagateChange) {
            this.onChange(value);
        }
        this.value = transformedValue;
    }

    private transformValue(value: string) {
        if ((value.match(/\./g) || []).length <= 1) {

            const valueParts = value.split('.');
            const integerValue = this.decimalPipe.transform(valueParts[0], '', 'en-US')?.replace(/[,]/g, ' ');

            const separatedValue = integerValue + (valueParts.length > 1 ? '.' + valueParts[1] : '');

            return separatedValue;
        }
        else
            return this.value;
    }

    // ControlValueAccessor Interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    writeValue(value: any): void {
        value = value ? String(value) : '';
        this.formatValue(value, false);
    }
}