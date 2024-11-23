<script lang="ts">
  let item: any;
  export {item};
</script>

<style>
  .menu__link {
    display: flex;
    background-color: transparent;
    color: white;
    border-width: 0;
    text-align: left;
    font-family: "Nunito";
    font-size: 16px;
    /* padding: 0.5em 0; */
    line-height: 1;
    padding: 0;
    box-sizing: border-box;
    transition: text-shadow 225ms ease-in-out;
  }

  .menu__link:hover {
    cursor: pointer;
    text-shadow: rgba(255, 255, 255, 1) 0px 0px 8px;
  }
</style>

<button class="menu__link" on:click="{item[1]}">{item[0]}</button>
