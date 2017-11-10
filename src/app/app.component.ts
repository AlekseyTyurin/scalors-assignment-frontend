import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";
import {Observable, Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('fakeInput') public fakeInputElem: ElementRef;


    public query = '';
    public programmLangs = ["Java", "PHP", "JavaScript", "TypeScript", "Scala", "Python", "Angular", "AngularJS", "Sass", "Less"];

    public filteredList: string[] = [];
    public selectedList: string[] = [];
    public elementRef;

    private subscrCollect: Subscription[];
    public selectedIdx: number;

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

        this.subscrCollect = [
            this.controlDeletion()
        ];
    }

    //Implement Autofocus for fake Input
    ngAfterViewInit() {
        this.fakeInputElem.nativeElement.focus();
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

    public select(item) {
        this.selectedList.push(item);
        this.query = '';
        this.filteredList = [];
        this.fakeInputElem.nativeElement.focus();
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
    private controlDeletion() {
        const keyDown = Observable.fromEvent(this.fakeInputElem.nativeElement, 'keydown').share();
        return keyDown.filter((e: any) => e.keyCode === 8)
            .subscribe((ev: Event) => {
                if (this.fakeInputElem.nativeElement.value === '' && this.selectedList.length > 0) {
                    this.remove(this.selectedList.length - 1);
                }
            });
    }

}