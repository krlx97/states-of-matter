import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChartOptions, ChartData} from "chart.js";
import {SvmService} from "services/svm.service";
import {UserService} from "services/user.service";

@Component({
  selector: "app-explore",
    template: `
    <div mat-dialog-title>Explore VMT</div>
    <div mat-dialog-content>
      <mat-list dense>
        <div matSubheader>Token Supply</div>
        <mat-list-item>Total<div class="spacer"></div>{{token.total}}</mat-list-item>
        <mat-list-item class="blue">Released<div class="spacer"></div>{{token.released}}</mat-list-item>
        <mat-list-item class="grey">Unreleased<div class="spacer"></div>{{token.unreleased}}</mat-list-item>
        <mat-divider></mat-divider>
        <div matSubheader>SVM Supply</div>
        <mat-list-item>Liquid<div class="spacer"></div>{{svmsupply.liquid}}</mat-list-item>
        <mat-list-item class="blue">Staked<div class="spacer"></div>{{svmsupply.staked}}</mat-list-item>
        <mat-list-item class="grey">Unstaking<div class="spacer"></div>{{svmsupply.unstaking}}</mat-list-item>
        <mat-divider></mat-divider>
        <div matSubheader>Settings</div>
        <mat-list-item>Payments<div class="spacer"></div>{{svmsupply.payments}}</mat-list-item>
        <mat-list-item>VMT per staked<div class="spacer"></div>{{vmtPerStake}}</mat-list-item>
        <mat-list-item>Next flush<div class="spacer"></div>tomorrow</mat-list-item>
      </mat-list>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="accent" (click)="onFlush()">FLUSH</button>
    </div>
  `,
  styles: [`
    button {
      width: 100%;
    }

    .blue {
      color: #42A5F5;
    }
    .grey {
      color: #BDBDBD;
    }
    .red {
      color: #EF5350;
    }

    .card-doughnut {
      height: 160px;
      width: 100%;
    }
  `]
})
export class ExploreComponent implements OnInit {
  x: ChartOptions = {
    borderColor: "#616161",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      }
    },
    events: []
  };

  public pieChartData: ChartData<"doughnut"> = {
    labels: ["Issued", "Unreleased"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#123456", "grey"]
    }]
  };

  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public isLoading = false;
  public token: any = {};
  public svmsupply: any = {};

  public get vmtPerStake (): string {
    return (parseFloat(this.svmsupply.payments) / parseFloat(this.svmsupply.staked)).toFixed(4) + " VMT";
  }

  public async onFlush (): Promise<void> {
    this.isLoading = true;

    const transaction = await this._svmService.api.transact({
      actions: [{
        account: "eternisvm131",
        name: "flush",
        authorization: [{
          actor: "eternisvm131",
          permission: "active"
        }],
        data: {/*need to pass name, sig & sym here...*/}
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    }).catch(console.log);

    if (!transaction) { return; }

    await this._userService.reloadUser().catch(console.error);
    await this._reloadTokens().catch(console.error);

    this.isLoading = false;
    this._matSnackBar.open("Tokens have been released and flushed", "OK");
  }

  private async _reloadTokens (): Promise<void> {
    const ftsupplyTable = await this._svmService.api.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "ftsupplies",
      lower_bound: "VMT",
      limit: 1
    });

    const statTable = await this._svmService.api.rpc.get_table_rows({
      code: "eternitkn131",
      scope: "........elapa", // how did this happen? :O o.O
      table: "stat"
    });
    const stat = statTable.rows[0];
    const ftSupply = ftsupplyTable.rows[0];

    this.svmsupply = ftSupply;

    this.token = {
      total: stat.max_supply,
      released: stat.supply,
      unreleased: (parseFloat(stat.max_supply) - parseFloat(stat.supply)).toFixed(4) + " VMT",
    };

    this.pieChartData = {
      labels: ["Released", "Unreleased"],
      datasets: [{
        data: [
          parseInt(this.token.released),
          parseInt(this.token.unreleased)
        ],
        backgroundColor: ["#42A5F5", "#BDBDBD"]
      }]
    };
  }

  public async ngOnInit (): Promise<void> {
    this._reloadTokens();
  }
}
