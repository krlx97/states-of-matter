import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SignedInComponent} from "./signed-in.component";
import {SignedOutComponent} from "./signed-out.component";

@NgModule({
  declarations: [SignedInComponent, SignedOutComponent],
  imports: [CommonModule]
})
export class GuardModule {}
