import {Component, OnInit, ElementRef, ViewChild, AfterViewInit, forwardRef} from '@angular/core';
import {FormGroup, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {Observable, Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AppComponent),
        multi: true
    }]
})
export class AppComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @ViewChild('fakeInput') public fakeInputElem: ElementRef;

    public query = '';
    public programmLangs: string[] = ["Java", "PHP", "JavaScript", "TypeScript", "Scala", "Python", "Angular", "AngularJS", "Ruby", "Go"];

    public filteredList: string[] = [];
    public selectedList: string[] = [];
    public elementRef;

    private subscrCollect: Subscription[];
    public selectedIdx: number;
    private _onChange = (_: any) => {};

    public form: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private myElement: ElementRef,) {
        this.elementRef = myElement;
        this.selectedIdx = -1;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            languages: ['']
        });
        const keyup = Observable.fromEvent(this.fakeInputElem.nativeElement, 'keyup').share();
        this.subscrCollect = [
            this.backspaceDeletion()
        ];
    }

    //Implement Autofocus for fake Input
    ngAfterViewInit() {
        this.fakeInputElem.nativeElement.focus();
    }

    public writeValue(value: string): void {
        if (value !== '' && this.selectedList.indexOf(value) < 0) {
            this.selectedList.push(value);
            this._onChange(this.selectedList);
        }
        this.fakeInputElem.nativeElement.value = '';
        this.selectedIdx = 0;
        this.filteredList = [];
        this.fakeInputElem.nativeElement.focus();
    }

    public registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: any): void {
    }

    public filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.programmLangs.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = [];
        }
    }

    public remove(item) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1);
    }

    public handleBlur() {
        if (this.selectedIdx > -1) {
            this.query = this.filteredList[this.selectedIdx];
        }
        this.filteredList = [];
        this.selectedIdx = -1;
    }

    public handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
        this.selectedIdx = -1;
    }

    //Implement deleting by BackSpace button
    private backspaceDeletion() {
        const keyDown = Observable.fromEvent(this.fakeInputElem.nativeElement, 'keydown').share();
        return keyDown.filter((e: any) => e.keyCode === 8)
            .subscribe((ev: Event) => {
                if (this.fakeInputElem.nativeElement.value === '' && this.selectedList.length > 0) {
                    this.remove(this.selectedList.length - 1);
                }
            });
    }

}