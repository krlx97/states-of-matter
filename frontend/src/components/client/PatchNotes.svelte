<script lang="ts">
  import {FontAwesome} from "components";
</script>

<style>
  h1 { margin-bottom: var(--spacing-sm); }
  ul { list-style-type: none; }

  .roadmap {
    display: flex;
    height: 100%;
  }
  .patch-notes {
    /* height: 100%; */
    flex-basis: 50%;
    padding: var(--spacing-md);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .litepaper {
    flex-basis: 50%;
    padding: var(--spacing-md);
    overflow-y: scroll;
  }

  .icon {
    height: 16px;
    width: 16px;
    vertical-align: middle;
  }
</style>

<div class="roadmap">
  <div class="patch-notes">

    <h1>States of Matter roadmap</h1>

    <hr>
  
    <h2>
      <span class="f--green"><FontAwesome icon="check"/></span> 0.1.0
      Collection & social sidenav
    </h2>
  
    <ul>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> UID authentication system</li>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> Create and manage decks</li>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> Add, remove, block and chat with friends</li>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> Change avatars</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 0.2.0
      Play custom game vs friends
    </h2>
  
    <ul>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> Create, close, join and leave lobbies</li>
      <li><span class="f--green"><FontAwesome icon="check-square"/></span> Start and end games</li>
      <li><span class="f--yellow"><FontAwesome icon="spinner fa-spin"/></span> Basic gameplay - Generate and shuffle decks, draw, play and attack cards</li>
      <li><FontAwesome icon="square"/> Advanced gameplay - Implement card effects mechanics</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 0.3.0
      Play casual game vs another random player
    </h2>
  
    <ul>
      <li><FontAwesome icon="square"/> Queue up and play against another random player</li>
      <li><FontAwesome icon="square"/> Gain experience points upon finishing the duel</li>
      <li><FontAwesome icon="square"/> Level up and receive AURA as a reward</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 0.4.0 Wallet
    </h2>
  
    <ul>
      <li><FontAwesome icon="square"/> UID wallet system</li>
      <li><FontAwesome icon="square"/> Deposit / withdraw tokens</li>
      <li><FontAwesome icon="square"/> Stake SOM token and receive AURA as a reward</li>
      <li><FontAwesome icon="square"/> Earn SOM tokens daily, based on AURA</li>
      <li><FontAwesome icon="square"/> Tip tokens to friends</li>
      <li><FontAwesome icon="square"/> Challenge friends to a $BET duel</li>
      <li><FontAwesome icon="square"/> Create TELOS accounts</li>
      <li><FontAwesome icon="square"/> Unlock new deck slots with TELOS</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span>
      0.5.0 Play Ranked vs another random player
    </h2>
  
    <ul>
      <li><FontAwesome icon="square"/> Queue up and play against another random player of similar skill level</li>
      <li><FontAwesome icon="square"/> Increase your ELO and gain AURA as a reward</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 0.6.0 - Leaderboards
    </h2>
  
    <ul>
      <li>
        <FontAwesome icon="square"/>
        Leaderboards by ELO
      </li>
      <li>
        <FontAwesome icon="square"/>
        Leaderboards by AURA
      </li>
      <li>
        <FontAwesome icon="square"/>
        Leaderboards by LEVEL
      </li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 0.7.0 Marketplace
    </h2>
  
    <ul>
      <li><FontAwesome icon="square"/> Avatars; Card, Cardback and Hero skins as NFTs</li>
      <li><FontAwesome icon="square"/> Free NFTs @ Levels 25, 50, 75 and 100</li>
      <li><FontAwesome icon="square"/> Gift NFTs to friends</li>
      <li><FontAwesome icon="square"/> Buy NFTs on the market from creators or other players</li>
      <li><FontAwesome icon="square"/> Sell NFTs on the market to other players</li>
    </ul>
  
    <h2>
      <span class="f--red"><FontAwesome icon="times"/></span> 1.0.0
    </h2>
  
    <ul>
      <li><FontAwesome icon="square"/> Official release 😊</li>
    </ul>
  
  </div>

  <div class="litepaper">
    <h1>
      States of Matter Litepaper
    </h1>
    <hr>
    <h3>
      T O K E N O M I C S
    </h3>
    <br>
    <p>
      <strong>1,000,000,000</strong>
      <img src="assets/currencies/shard.png" class="icon" alt="SOM"> total.
      <br>
      <strong>1,000,000</strong>
      <img src="assets/currencies/shard.png" class="icon" alt="SOM">
      (0.1%) will be flushed daily, for 1000 days.
      <br>
      <strong>200,000</strong>
      <img src="assets/currencies/shard.png" class="icon" alt="SOM">
      (0.02%, 20% total) will go to DEV.
      <br>
      <strong>800,000</strong>
      <img src="assets/currencies/shard.png" class="icon" alt="SOM">
      (0.08%, 80% total) to <img src="assets/currencies/som.png" class="icon" alt="SOM">
    </p>
    <br>
    <h3>
      F E E S
    </h3>
    <br>
    <p>
      1% of the fees collected from the list below will be paid back to
      <img src="assets/currencies/som.png" class="icon" alt="SOM"> each day.
    </p>
    <ul>
      <li>
        Buying / selling items on the market
      </li>
      <li>
        $BET duels
      </li>
      <li>
        Withdrawing tokens
      </li>
      <li>
        Tipping tokens
      </li>
      <li>
        Gifting skins (fixed fee)
      </li>
    </ul>
    <br>
    <h3>
      A U R A
    </h3>
    <br>
    <p>
      AURA will be increased by leveling up, increasing ranked ELO and staking
      SOM tokens. Players will require a fixed amount of AURA to be eligible
      for daily rewards. Inactive players will not be eligible for rewards,
      nor visible on the leaderboards.
    </p>
    <br>
    <h3>
      L E V E L S
    </h3>
    <br>
    <p>
      Infinite levels system, each level will require exponentially more XP
      <br>
      Base XP reward per game will be 10, +1 for each minute the game lasted
      <br>
      Leveling up will not reset the XP
      <br>
      Higher levels will reward exponentially more
      <img src="assets/currencies/som.png" class="icon" alt="SOM">
      <br>
      Special NFT reward @ levels <span class="f--green">25</span>,
      <span class="f--blue">50</span>, <span class="f--purple">75</span> and
      <span class="f--orange">100</span>
      <br>
      <strong>XP REQUIRED = (LEVEL * 10) ^ (LEVEL / 100 + 1)</strong>
    </p>
    <br>
    <h3>
      S T A K I N G
    </h3>
    <br>
    <p>
      There will be 4 staking periods: <span class="f--green">30</span>,
      <span class="f--blue">90</span>, <span class="f--purple">180</span> and
      <span class="f--orange">360</span> days. Longer lockup period and more tokens
      will yield more AURA. Stake can be claimed back after it expires.
    </p>
    <br>
    <h3>
      R A N K E D
    </h3>
    <br>
    <p>
      Winning or losing ranked games will increase or decrease players ELO.
      Base ELO gain will be 20 / -20 ELO, per game. Winning a match against a higher
      ELO player will increase the ELO reward, but winning against a lower
      ELO players will decrease the ELO reward. Losing a game against a higher
      ELO player will decrease the ELO penalty, while losing against a lower ELO
      player will increase the ELO penalty. Much like levels, higher ELO will
      yield exponentially more <img src="assets/currencies/SOM.png" class="icon" alt="SOM">
    </p>
  </div>
</div>