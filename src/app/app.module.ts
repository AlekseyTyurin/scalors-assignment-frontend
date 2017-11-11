import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ChipInputComponent} from "./chip-input/chip-input.component";


@NgModule({
    declarations: [
        AppComponent,
        ChipInputComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
