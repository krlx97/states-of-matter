<script lang="ts">
  import {items} from "data";
  import {modalService} from "services";
  import {modalStore} from "stores";
  import {ItemComponent, ModalComponent} from "ui";

  let innerElement: HTMLDivElement;
  let revealed = false;
  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);

  const onClose = (): void => {
    modalService.close();
  };

  const onReveal = (): void => {
    innerElement.style.transform = "rotateY(180deg)";
    revealed = true;
  };
</script>

<style>
.flip-card {
  /* background-color: transparent; */
  width: 112px;
  height: 160px;
  transform: perspective(320px);
  /* box-sizing: border-box; */
  perspective: 320px;
}

.flip-card-inner {
  position: relative;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card-front, .flip-card-back {
  position: absolute;
  /* width: 100%;
  height: 100%; */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  color: white;
width: 112px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  border: 2px solid;
  border-radius: 8px;
box-sizing: border-box;
  animation: border-animation 1s linear infinite;
}
@keyframes border-animation {
  0% {border-color: rgb(var(--green));}
  50% {border-color: rgb(var(--blue));}
  100% {border-color: rgb(var(--purple));}
}

.flip-card-back {
  transform: rotateY(180deg);
}


.modal2 {
  width: auto;
  align-items: center;
}
</style>

<ModalComponent isClosable={false} dark={true}>
  <div class="modal modal2">
    <div class="modal__title">
      Chest unlocked
    </div>

    <div class="flip-card">
      <div class="flip-card-inner" bind:this={innerElement}>
        <div class="flip-card-front">
          ?
        </div>
        <div class="flip-card-back">
          <ItemComponent {item}/>
        </div>
      </div>
    </div>

    <div class="modal__submit">
      {#if revealed}
        <button on:click={onClose}>CLOSE</button>
      {:else}
        <button on:click={onReveal}>REVEAL</button>
      {/if}
    </div>
  </div>
</ModalComponent>
