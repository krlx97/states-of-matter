<script lang="ts">
  import {onMount} from "svelte";
  import {ethersService, socketService} from "services";

  const {ethereum} = window;
const stepValid = {
    one: false,
    two: false,
    three: true
  };
  let selectedAccount = "";
const onSelectNetwork = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x29' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x29",
        rpcUrls: ["https://testnet.telos.net/evm"],
        chainName: "Telos Testnet",
        nativeCurrency: {
          name: "TLOS",
          symbol: "TLOS",
          decimals: 18
        },
        blockExplorerUrls: ["https://teloscan.io/"]
      }]
    });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
    // ethereum.request({
    //   method: "wallet_addEthereumChain",
    //   params: [{
    //     chainId: "0x29",
    //     rpcUrls: ["https://testnet.telos.net/evm"],
    //     chainName: "Telos Testnet",
    //     nativeCurrency: {
    //       name: "TLOS",
    //       symbol: "TLOS",
    //       decimals: 18
    //     },
    //     blockExplorerUrls: ["https://teloscan.io/"]
    //   }]
    // });
  };

  const onConnectMetamask = async (): Promise<void> => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    selectedAccount = accounts[0] || "Account not selected";
  };

  const onSignin = async (): Promise<void> => {
    socketService.socket.emit("signin", {
      publicKey: selectedAccount
    });
  };

  onMount(async (): Promise<void> => {
    (ethereum as any).on("accountsChanged", (accounts) => {
      selectedAccount = accounts[0];
      stepValid.two = accounts[0] !== undefined;
    });

    (ethereum as any).on("chainChanged", (chainId) => {
      stepValid.three = chainId === "0x539";
    });

    const accounts = await ethereum.request({
      method: "eth_accounts"
    });

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    selectedAccount = accounts[0];

    stepValid.one = typeof window.ethereum !== undefined;
    stepValid.two = accounts[0] !== undefined;
    stepValid.three = true;
    // stepValid.three = chainId === "0x539";
  });
</script>

<style>

  .signin__steps {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    /* text-align: justify; */
  }

  .signin__step {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    /* padding: var(--spacing-md) 0; */
/* border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(31, 31, 31, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(31, 31, 31, 1) 100%
    ) 1; */
  }

  .signin__step__title {
    font-size: var(--font-lg);
    /* margin-bottom: var(--spacing-md); */
  }

  .signin__step__info {
    line-height: 1.4;
    text-align: justify;
  }

  
</style>

<div class="signin__steps">
  <div>
    To unlock level up rewards and access inventory and the market, it is necessary to link
    your Metamask wallet. As States of Matter is a complex game, our team is
    continually working to address any game balance issues that may arise. As a
    result, the balance of the game may be adjusted, which could directly affect
    the prices of in-game items on the market. Please keep in mind that any
    speculation regarding these changes carries its own risks.
  </div>
    <div class="signin__step">
      <div class="signin__step__title">
        <b>Step 1</b> |
        <span class:green={stepValid.one} class:red={!stepValid.one}>
          Install metamask
        </span>
      </div>
      {#if !stepValid.one}
        <div class="signin__step__info">
          You can go to metamask's website by clicking the button below. Once
          you are there, download and install the metamask extension for your
          browser, then follow the steps to create the metamask wallet. After
          you have completed the installation, refresh this page to proceed.
        </div>
        <a href="https://metamask.io/" target="_blank">
          <button>
            <i class="fa-solid fa-up-right-from-square"></i> METAMASK.IO
          </button>
        </a>
      {/if}
    </div>

    <div class="signin__step">
      <div class="signin__step__title">
        <b>Step 2</b> |
        <span class:green={stepValid.two} class:red={!stepValid.two}>
          Connect with metamask
        </span>
      </div>
      {#if stepValid.one && !stepValid.two}
        <div class="signin__step__info">
          In order to display your wallet assets, you need to connect your
          Metamask account to the game. Your game account will be linked to your
          Metamask account. It's worth noting that if you change your Metamask
          account, it's the same as changing your game account.
        </div>
        <div>
          <button on:click={onConnectMetamask}>
            CONNECT
          </button>
        </div>
      {/if}
    </div>

    <div class="signin__step">
      <div class="signin__step__title">
        <b>Step 3</b> |
        <span class:green={stepValid.three} class:red={!stepValid.three}>
          Select Telos EVM network
        </span>
      </div>
      {#if stepValid.one && stepValid.two && !stepValid.three}
        <div class="signin__step__info">
          States of Matter is powered by the Telos EVM network. To switch to
          this network and add it to your Metamask extension, click the button
          below.
        </div>
        <div>
          <button on:click={onSelectNetwork}>SWITCH</button>
        </div>
      {/if}
    </div>


  </div>
    {#if stepValid.one && stepValid.two && stepValid.three}
      <div>
        <div>Selected account</div>
        <div class="purple font-sm"><pre>{selectedAccount}</pre></div>

        <button on:click={onSignin} >
          SIGNIN
        </button>
      </div>
    {:else}
      <div>
        Signin will be available once you complete all three steps.
      </div>
    {/if}