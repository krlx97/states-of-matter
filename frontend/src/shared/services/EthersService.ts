import {ethers} from "ethers";
import SomCurrency from "@som/contracts/SomCurrency/artifacts/SomCurrency.json";
import SomGame from "@som/contracts/SomGame/artifacts/SomGame.json";
import SomSkins from "@som/contracts/SomSkins/artifacts/SomSkins.json";
import {items} from "data";
import {walletStore} from "stores";
import {get} from "svelte/store";

const wtlosAbi = [
  "function deposit () payable",
  "function increaseAllowance (address spender, uint256 addedValue) public returns (bool)",
  "function allowance (address owner, address spender) public view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)"
];

class EthersService {
  private readonly _provider = window.ethereum ?
    new ethers.providers.Web3Provider(window.ethereum) :
    new ethers.providers.JsonRpcProvider("https://testnet.telos.net");

  private readonly _signer = this._provider.getSigner();
  public key: string;

  public readonly keys = {
    currency: "0x767cdaEE9Ddd389d83F1CE10D1e601d626088E60",
    skins: "0xC003f2577F8bF63C9FE879A5CD28Cd707656e95b",
    game: "0x5Cad21599aDF8bdf37879Ed63532B6a4418d876b",
    wtlos: "0xaE85Bf723A9e74d6c663dd226996AC1b8d075AA9"
  };

  public readonly contracts = {
    currency: new ethers.Contract(this.keys.currency, SomCurrency.abi, this._provider),
    skins: new ethers.Contract(this.keys.skins, SomSkins.abi, this._provider),
    game: new ethers.Contract(this.keys.game, SomGame.abi, this._provider),
    wtlos: new ethers.Contract(this.keys.wtlos, wtlosAbi, this._provider)
  };

  public readonly sign = {
    currency: this.contracts.currency.connect(this._signer),
    skins: this.contracts.skins.connect(this._signer),
    game: this.contracts.game.connect(this._signer),
    wtlos: this.contracts.wtlos.connect(this._signer)
  };

  public async transact (
    contract: keyof typeof this.sign,
    action: string,
    params: any[]
  ): Promise<boolean> {
    const tx = await this.sign[contract][action](...params).catch(console.log);
    if (!tx) { return false; }
    const fin = await tx.wait();
    if (!fin) { return false; }
    return true;
  }

  public format (val: ethers.BigNumber) {
    return ethers.utils.formatUnits(val);
  }

  public async loadUser (): Promise<void> {
    const {key} = this;
    console.log({key});
    const {currency, skins, game} = this.contracts;
    const player = await game.players(key);
    const total = await game.total();
    const pool = await game.pool();
    const theItems = [];

    // for (const item of items) {
    //   theItems.push({
    //     id: item.id,
    //     balance: await skins.balanceOf(key, item.id)
    //   });
    // }

    walletStore.set({
      crystals: {
        balance: await currency.balanceOf(key),
        staked: player.staked,
        unstaked: player.unstaked,
        vesting: player.vesting,
        rewards: player.rewards,
        airdrops: player.airdrops,
        starterPack: player.hasClaimedStarterPack,


        liquidity: await game.userLiquidity(key)
      },
      crystalsGlobal: {
        cap: await currency.cap(),
        totalSupply: await currency.totalSupply(),
        staked: total.staked,
        unstaked: total.unstaked,
        burned: total.burned,
        rewards: total.rewards,
        airdrops: total.airdrops,
      },
      crystalsPool: {
        toRewards: pool.toRewards,
        toBurned: pool.toBurned,
      },
      essence: {
        balance: await skins.balanceOf(key, 0)
      },
      isApprovedForAll: await skins.isApprovedForAll(key, this.keys.game),
      allowance: await currency.allowance(key, this.keys.game),
      items: theItems
    });

    console.log(get(walletStore));
  }
}

export {EthersService};
