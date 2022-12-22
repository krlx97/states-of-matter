import {Component} from "@angular/core";

@Component({
  selector: "app-how-to-withdraw",
  template: `
    <h1 mat-dialog-title>How to withdraw</h1>
    <div mat-dialog-content>
      When transfering tokens, instead of Eternitas name fill in your Telos
      account name and tick the "Withdraw to Telos account" checkbox. If you are
      withdrawing to an exchange make sure to <strong>correctly fill the memo
      field</strong> or your assets will be permanently lost.
    </div>
  `,
})
export class HowToWithdrawComponent {}
