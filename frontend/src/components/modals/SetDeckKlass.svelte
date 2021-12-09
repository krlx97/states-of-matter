<script lang="ts">
  import {Hero, Modal} from "components";
  import {heroes} from "data";
  import {socketService} from "services";
  import {modalStore} from "stores/view";

  const onSetDeckKlass = (klass: number): void => {
    const {id} = $modalStore.data;
    socketService.emit("setDeckKlass", {id, klass});
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .klasses {
    width: calc($game-card-width * 2 + $spacing-md * 3);
    padding: $spacing-sm 0 0 $spacing-sm;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .klass {
    margin: 0 $spacing-sm $spacing-sm 0;
  }
</style>

<Modal>
  <h2>
    Select your Class
  </h2>

  <p>
    <i>* Changing deck class will also clear the deck.</i>
  </p>

  <div class="klasses">
    <div class="klass" on:click={() => onSetDeckKlass(1)}>
      <Hero hero={heroes.get(1)}/>
    </div>
    <div class="klass" on:click={() => onSetDeckKlass(2)}>
      <Hero hero={heroes.get(2)}/>
    </div>
    <div class="klass" on:click={() => onSetDeckKlass(3)}>
      <Hero hero={heroes.get(3)}/>
    </div>
    <div class="klass" on:click={() => onSetDeckKlass(4)}>
      <Hero hero={heroes.get(4)}/>
    </div>
  </div>
</Modal>
