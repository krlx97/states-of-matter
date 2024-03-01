<script lang="ts">
  import SigninComponent from "./Signin.svelte";
  import SignupComponent from "./Signup.svelte";
  import {LinkComponent, TextComponent} from "ui";

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
    background-image: url("/images/authbg.png");
  }

  .nav {
    display: flex;
    justify-content: space-evenly;
  }

  .auth__sidenav {
    height: 100%;
    width: 384px;
    padding: var(--md);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(4px);
    background-color: rgba(31, 31, 31, 0.8);
    border: 0 solid;
    border-right-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1;
    box-sizing: border-box;
  }

  .auth__notification {
    line-height: 1.25;
    text-align: justify;
  }

  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    text-decoration-color: rgb(var(--primary));
  }
</style>

<div class="auth">
  <div class="auth__sidenav">
    <div class="nav">
      {#each views as view}
        <LinkComponent
          isActive="{view.name === currentView.name}"
          on:click="{() => currentView = view}">
          {view.name}
        </LinkComponent>
      {/each}
    </div>

    <svelte:component this="{currentView.component}"/>

    <div class="auth__notification">
      States of Matter is currently in
      <a
        href="https://github.com/krlx97/states-of-matter"
        rel="noreferrer"
        target="_blank">
        <TextComponent color="primary">Open Beta v0.4.0</TextComponent>
      </a>
      <br/><br/>
      The game is mostly stable but things could still break! If you have
      complaints or suggestions, come chat with us on our
      <a
        href="https://discord.com/invite/4xazmkjrkn"
        rel="noreferrer"
        target="_blank">
        <TextComponent color="primary">discord</TextComponent>
      </a>
    </div>
  </div>
</div>
