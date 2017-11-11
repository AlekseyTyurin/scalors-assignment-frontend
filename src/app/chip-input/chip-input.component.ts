import {Component, OnInit, forwardRef, ViewChild, ElementRef, HostListener, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, FormGroup, FormBuilder, ControlValueAccessor} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {Key} from "../interfaces/key.model";

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-chip-input',
    templateUrl: './chip-input.component.html',
    styleUrls: ['./chip-input.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ChipInputComponent),
        multi: true
    }]
})
export class ChipInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @ViewChild('fakeInput') public fakeInputElem: ElementRef;

    public query = '';
    public programmLanguages: Observable<string[]> = Observable.of(["Java", "PHP", "JavaScript", "TypeScript", "Scala", "Python", "Angular", "AngularJS", "Ruby"]);

    public filteredList: string[] = [];
    public selectedList: string[] = [];
    public elementRef;

    public subscrCollect: Subscription[];
    public selectedIdx: number;
    private _onChange = (_: any) => {
    };

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
            this.backspaceDeletion(),
            this.findItem(keyup),
            this.keyboardNav(keyup),
            this.filterEnter(keyup),
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

    //Remove chosen item/programming language
    public removeItem(item) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1);
    }

    //Implement deleting by BackSpace button
    private backspaceDeletion() {
        const keyDown = Observable.fromEvent(this.fakeInputElem.nativeElement, 'keydown').share();
        return keyDown.filter((e: any) => e.keyCode === Key.Backspace)
            .subscribe((ev: Event) => {
                if (this.fakeInputElem.nativeElement.value === '' && this.selectedList.length > 0) {
                    this.removeItem(this.selectedList.length - 1);
                }
            });
    }

    //Choose programming languages by Enter button click
    private filterEnter(keyObj: Observable<{}>) {
        return keyObj.filter((e: any) => e.keyCode === Key.Enter)
            .subscribe((ev: Event) => {
                ev.preventDefault();
                if (this.filteredList.length > 0) {
                    this.writeValue(this.filteredList[this.selectedIdx]);
                }
            });
    }

    // Implement close dropdown list by pushing ESC
    @HostListener('keydown', ['$event'])
    onChange(e: KeyboardEvent) {
        if (e.keyCode === Key.Esc) {
            this.filteredList = [];
            console.log(this.filteredList[0])
        }
    }

    private isActive(index: number) {
        return (index === this.selectedIdx);
    }

    private findItem(keyObj: Observable<{}>) {
        return keyObj.filter((e: any) => this.filterNonCharKey(e.keyCode))
            .map((e: any) => e.target.value)
            .debounceTime(350)
            .concat()
            .filter((q: string) => q.length > 0)
            .switchMap((q: string) => this.findInArray(q))
            .subscribe((results: string[]) => {
                this.filteredList = results;
                this.selectedIdx = 0;
            });
    }

    private findInArray(query: string): Observable<string[]> {
        const regexp = new RegExp(query, 'ig');
        return this.programmLanguages.map(item => item.filter((el: string) => {
            return regexp.test(el);
        }));
    }

    private filterNonCharKey(keyCode: number): boolean {
        return Object.keys(Key).map(k => Key[k]).every(kCode => kCode !== keyCode);
    }

    private keyboardNav(keyObj: Observable<{}>) {
        return keyObj.filter((e: any) => (e.keyCode === Key.Up || e.keyCode === Key.Down))
            .map((e: any) => e.keyCode)
            .subscribe(kCode => {
                if (this.filteredList.length > 0) {
                    if (kCode === Key.Up && this.selectedIdx > 0) {
                        this.selectedIdx--;
                    }
                    if ((kCode === Key.Down || kCode === Key.Tab) && (this.selectedIdx < this.filteredList.length - 1)) {
                        this.selectedIdx++;
                    }
                }
            });
    }

}
