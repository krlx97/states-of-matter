<script lang="ts">
  import SigninComponent from "./Signin.svelte";
  import SignupComponent from "./Signup.svelte";

  const views = [{
    name: "Signin",
    component: SigninComponent
  }, {
    name: "Signup",
    component: SignupComponent
  }];

  let currentView = views[0];
</script>

<style>
  .auth {
    height: 100%;
    width: 100%;
    background-image: url("assets/authbg.png");
  }

  .auth__sidenav {
    height: 100%;
    width: 384px;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(4px);
    background-color: rgba(31, 31, 31, 0.8);
    border: 0 solid;
    border-right-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgba(31, 31, 31, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(31, 31, 31, 1) 100%
    ) 1;
    box-sizing: border-box;
  }

  .auth__notification {
    line-height: 1.5;
    text-align: justify;
  }
</style>

<div class="auth">
  <div class="auth__sidenav">
    <div class="nav">
      {#each views as view}
        <button
          class="nav__link"
          class:linkActive="{view.name === currentView.name}"
          on:click="{() => currentView = view}"
          on:keypress="{() => currentView = view}">
          {view.name}
        </button>
      {/each}
    </div>

    <svelte:component this="{currentView.component}"/>

    <div class="auth__notification">
      States of Matter is currently in
      <a
        href="https://github.com/krlx97/states-of-matter"
        rel="noreferrer"
        target="_blank">
        Closed Alpha v0.3.3
      </a>.
      Things can and will break! If you have complaints or suggestions, come
      chat with us on our
      <a
        href="https://discord.com/invite/4xazmkjrkn"
        rel="noreferrer"
        target="_blank">
        discord
      </a>
    </div>
  </div>
</div>
