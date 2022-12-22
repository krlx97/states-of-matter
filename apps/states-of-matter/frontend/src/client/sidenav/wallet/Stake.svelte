<script lang="ts">
  import Textfield from "@smui/textfield";
  import List, { Item, Separator, Text } from '@smui/list';

  let valueA = "";
</script>

<style>
  .stake {
    padding: var(--spacing-md);
  }
</style>

<div class="stake">
  <h3>Stake</h3>
  <p>Stake VMT to receive daily rewards and increase your game voting power</p>
  <form>
    <!-- <Textfield type="number" variant="outlined" label="Amount" bind:value={valueA}></Textfield> -->
    <label>
      <div class="label-body">Amount</div>
      <input type="number" placeholder="Amount" bind:value={valueA}/>
    </label>
  </form>
  <List nonInteractive>
    <Item>
      <Text>FEE 0.1000 TLOS</Text>
    </Item>
    <Item>
      <Text>REMAINING 8.7000 TLOS</Text>
    </Item>
    <Separator/>
    <Item>
      <Text>STAKE 0.0000 VMT</Text>
    </Item>
    <Item>
      <Text>REMAINING 257.0000 VMT</Text>
    </Item>
  </List>
</div>
