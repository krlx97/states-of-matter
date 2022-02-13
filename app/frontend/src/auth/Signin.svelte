<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {authStore} from "auth/stores";

  import Button from "../ui/Button.svelte";
  import Form from "../ui/Form.svelte";
  import Input from "../ui/Input.svelte";
  import Text from "../ui/Text.svelte";

  const dispatch = createEventDispatcher();

  const onSignin = (): void => {
    const {username} = $authStore.signinForm;
    socketService.getPrivateKeyHash({username});
  };

  const onGotoSignup = (): void => { dispatch("gotoSignup"); };
</script>

<style lang="scss">
  @import "../shared/styles/variables";


  .form__btn {
    display: flex;
    justify-content: center;
  }
</style>

<Form on:submit={onSignin}>
  <Text size="xlg">Sign in</Text>

  <hr/>

  <Input
    placeholder="Username"
    maxlength={16}
    bind:value={$authStore.signinForm.username}/>

  <Input
    placeholder="Password"
    type="password"
    maxlength={32}
    bind:value={$authStore.signinForm.password}/>

  <!-- <div class="form__btn"> -->
    <Button type="submit">
      SIGN IN
    </Button>
  <!-- </div> -->

</Form>

<div>
  Dont have an account?
  <div style="text-decoration: underline" on:click={onGotoSignup}>Sign up</div>
</div>
