import {Component, type OnInit} from "@angular/core";
import {SvmService} from "services/svm.service";
import type {ChartData, ChartOptions} from "chart.js";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "services/user.service";

@Component({
  selector: "app-game",
  template: `
    <mat-tab-group mat-stretch-tabs>
      <mat-tab label="Tokens">
        <div class="cards">
          <!-- <mat-card>
            <mat-card-header>
              <img mat-card-avatar src="assets/tokens/DMT.png"/>
              <mat-card-title>Dark Matter DMT</mat-card-title>
              <mat-card-subtitle>Governance Token</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-list dense>
                <mat-list-item>Total<div class="spacer"></div>{{tokens.dmt.total}}</mat-list-item>
                <mat-list-item>Released<div class="spacer"></div>{{tokens.dmt.released}}</mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card> -->
          <mat-card>
            <mat-card-header>
              <img mat-card-avatar src="assets/tokens/VMT.png"/>
              <mat-card-title>Void Matter VMT</mat-card-title>
              <mat-card-subtitle>States of Matter Token</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="card-doughnut">
                <canvas baseChart type="doughnut" [data]="pieChartData" [options]="x"></canvas>
              </div>

              <mat-list dense>
                <div matSubheader>Supply</div>
                <mat-list-item>Total<div class="spacer"></div>{{tokens.vmt.total}}</mat-list-item>
                <mat-list-item class="blue">Released<div class="spacer"></div>{{tokens.vmt.released}}</mat-list-item>
                <mat-list-item class="grey">Unreleased<div class="spacer"></div>{{tokens.vmt.unreleased}}</mat-list-item>
                <mat-divider></mat-divider>
                <div matSubheader>Settings</div>
                <mat-list-item>LMT per DMT<div class="spacer"></div>soon.00 LMT</mat-list-item>
                <mat-list-item>Next flush<div class="spacer"></div>tomorrow</mat-list-item>
              </mat-list>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" (click)="onFlush()">FLUSH</button>
            </mat-card-actions>
          </mat-card>
        </div>

      </mat-tab>
      <mat-tab label="Vote">
        <div class="vote">
          Coming soon...
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    mat-card {
      margin: var(--spacing);
    }

    .vote {
      text-align: center;
      margin: var(--spacing);
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
export class GameComponent implements OnInit {
  public totalLMT = "";
  public totalDMT = "";
  public lmtPerDmt = "";
  public setting: any;

  public tokens: any = {};

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
    labels: ["Issued", "Unreleased", "Burned"],
    datasets: [{
      data: [parseInt(this.totalLMT), 1000000000000 - parseInt(this.totalLMT), 12345],
      backgroundColor: ["#123456", "grey", "red"]
    }]
  };

  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public isLoading = false;

  public async onFlush (): Promise<void> {
    this.isLoading = true;

    const transaction = await this._svmService.push("flush", {});

    if (!transaction) { return; }

    await this._userService.reloadUser().catch(console.error);
    await this._reloadTokens().catch(console.error);

    this.isLoading = false;
    this._matSnackBar.open("Tokens have been released and flushed", "OK");
  }

  private async _reloadTokens (): Promise<void> {
    const statTable = await this._svmService.api.rpc.get_table_rows({
      code: "eternitkn131",
      scope: "........elapa",
      table: "stat"
    });
    const stat = statTable.rows[0];

    console.log(stat);

    // const DMT = statTable.rows.find((stat) => stat.max_supply.includes("DMT"));
    // const LMT = statTable.rows.find((stat) => stat.max_supply.includes("LMT"));
    // const unisuedLMT = `${(parseInt(LMT.max_supply) - parseInt(LMT.supply)).toFixed(4)} LMT`;
    // const LMTperDMT = `${(parseInt("200000.0000") / parseInt(DMT.supply)).toFixed(4)} LMT`;

    const tokens = {
      vmt: {
        total: stat.max_supply,
        released: stat.supply,
        unreleased: (parseFloat(stat.max_supply) - parseFloat(stat.supply)).toFixed(4) + " VMT",
      }
    };

    this.tokens = tokens;
    this.pieChartData = {
      labels: ["Released", "Unreleased"],
      datasets: [{
        data: [
          parseInt(tokens.vmt.released),
          parseInt(tokens.vmt.unreleased)
        ],
        backgroundColor: ["#42A5F5", "#BDBDBD"]
      }]
    };
  }

  public async ngOnInit (): Promise<void> {
    this._reloadTokens();
  }
}
