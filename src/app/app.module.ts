import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { SurveyCreatorComponent } from "./components/creator.component";

@NgModule({
    declarations: [AppComponent, SurveyCreatorComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
