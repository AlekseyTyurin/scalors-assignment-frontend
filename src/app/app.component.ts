import {Component, OnInit, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public query = '';
    public programmLangs = ["Java", "PHP", "JavaScript", "TypeScript", "Scala", "Python", "GO", "AngularJS", "Angular", "Ruby"];

    public filteredList = [];
    public selected = [];
    public elementRef;
    public selectedIdx: number;

    public mockForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                myElement: ElementRef,) {
        this.elementRef = myElement;
        this.selectedIdx = -1;
    }

    ngOnInit() {
        this.mockForm = this.formBuilder.group({
            languages: ""
        })
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
        this.query = item;
        this.filteredList = [];
        this.selectedIdx = -1;
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
}