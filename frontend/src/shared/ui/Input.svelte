<script lang="ts">
  import {slide} from "svelte/transition";
  import {soundService} from "services";
    import { TextComponent } from "ui";

  let label = "";
  let type: "text" | "password" | "radio" | "checkbox" = "text";
  let icon = "";
  let error = "";
  let action: [string, () => void] | undefined = undefined;
  let value = "";
  let name = "";
  let group = "";
  let disabled = false;
  let checked = false;

  const id = label.toLowerCase();
  const alt = icon.toUpperCase();

  const onClick = (): void => {
    soundService.play("click");
  };

  export {label, type, icon, action, error, value, name, group, disabled, checked};
</script>

<style>
  .form__field {
    position: relative;
    padding-top: 8px; /* half of the 16px label overflows over form__field, so 8px accounts for it */
  }

  .input {
    height: 50px;
    width: 100%;
    /* Since input is 48px height and text is 16px vertical centered, there is 16px "padding" on top and bot. */
    /* We therefore don't set top and bottom padding */
    /* right padding for the 32px image, + 2x 8px image "padding" */
    /* Left padding 15px, +1px border makes 16px "padding" */
    padding: 0 48px 0 16px;
    display: block;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    color: white;
    font: var(--md)/1 "Nunito";
    /* font-family: "Nunito"; */
    /* font-size: var(--font-md); */
    letter-spacing: 4px;
    transition:
      border-color 0.4s cubic-bezier(var(--ease-in-out-quad)),
      color 0.4s cubic-bezier(var(--ease-in-out-quad));
  }

  .input:disabled {
    color: rgb(127, 127, 127);
  }

  

  .input:hover {
    border-color: white;
  }

  .input:focus {
    border-color: rgb(var(--primary));
    outline: 0;
  }

  .input:focus + label {
    transform: translateY(-24px);
  }

  .input:not(:placeholder-shown) + label {
    transform: translateY(-24px);
  }

.input-invalid {
    border-color: rgb(var(--warn));
  }
  .input-invalid:hover {
    border-color: rgb(var(--warn));
  }
  .input-invalid:focus {
    border-color: rgb(var(--warn));
    outline: 0;
  }

  .label {
    position: absolute;
    /* 8px top padding from form__field, +16px text padding */
    top: 24px;
    /* again, simulate the 16px "padding", but since label is absolute border 1px doesnt count */
    left: 16px;
    cursor: text;
    background: linear-gradient(
      0deg,
      rgba(31,31,31,1) 0%,
      rgba(31,31,31,1) 50%,
      rgba(255,255,255,0) 50%,
      rgba(255,255,255,0) 100%
    );
    transition:
      color 0.2s cubic-bezier(var(--ease-in-out-quad)),
      transform 0.2s cubic-bezier(var(--ease-in-out-quad));
  }

  img {
    position: absolute;
    /* 8px padding, +8px "padding" */
    top: 16px;
    right: 8px;
    /* resize imgs and remove below */
    height: 32px;
  }

  .form__field__more {
    height: 16px;
    margin-top: 8px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: 0;
    color: white;
    cursor: pointer;
    font: 16px/1 "Nunito";
    text-decoration: underline;
  }

  .radio-field {
    display: flex;
    align-items: center;
  }

  

  input[type="radio"] {
    margin: 0;
    height: 24px;
    width: 24px;
    margin-right: var(--md);
    accent-color: rgb(var(--plasma));
  }

  input[type="checkbox"] {
    margin: 0;
    margin-right: var(--md);
    height: 24px;
    width: 24px;
    accent-color: rgb(var(--plasma));
  }
</style>

{#if type === "text"}
  <div class="form__field">
    <input class="input" class:input-invalid="{error}" {id} {disabled} placeholder=" " bind:value on:input on:click="{onClick}"/>
    <label class="label" for="{id}">{label}</label>
    <img src="images/currencies/sm/{icon}.png" {alt}/>
    <div class="form__field__more">
      <TextComponent color="warn">
        {#if error}
          <div in:slide>{error}</div>
        {/if}
      </TextComponent>
      {#if action}
        <button type="button" on:click="{action[1]}">{action[0]}</button>
      {/if}
    </div>
  </div>
{:else if type === "password"}
  <div class="form__field">
    <input class="input" {id} {disabled} type="password" placeholder=" " bind:value on:input on:click="{onClick}"/>
    <label class="label" for="{id}">{label}</label>
    <img src="images/currencies/sm/{icon}.png" {alt}/>
    <div class="form__field__more">
      <TextComponent color="warn">
        {#if error}
          <div in:slide>{error}</div>
        {/if}
      </TextComponent>
      {#if action}
        <button type="button" on:click="{action[1]}">{action[0]}</button>
      {/if}
    </div>
  </div>
{:else if type === "radio"}
  <div class="radio-field">
    <input {id} type="radio" {value} {name} bind:group on:click="{onClick}"/>
    <label for="{id}">{label}</label>
  </div>
{:else}
  <div class="radio-field">
    <input {id} type="checkbox" {value} {name} bind:checked on:click="{onClick}"/>
    <label for="{id}">{label}</label>
  </div>
{/if}
