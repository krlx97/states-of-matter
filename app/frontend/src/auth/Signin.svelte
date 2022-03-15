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

<div>
  <Text size="xlg">Sign in</Text>

  <br/>

  <Form on:submit={onSignin}>
    <Input placeholder="Username" maxlength={16} bind:value={$authStore.signinForm.username}/>
    <Input placeholder="Password" type="password" maxlength={32} bind:value={$authStore.signinForm.password}/>
    <Button type="submit">SIGN IN</Button>
  </Form>

  <br/>

  <Text>
    Dont have an account?
    <Text color="purple" isUnderline={true} on:click={onGotoSignup}>Sign up</Text>
  </Text>
</div>
