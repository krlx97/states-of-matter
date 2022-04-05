<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {authStore} from "stores";
  import {Button, Form, Input, Text} from "ui";

  const dispatch = createEventDispatcher();

  const onSignin = () => {
    const {username} = $authStore.signinForm;
    socketService.socket.emit("getPrivateKeyHash", {username});
  };

  const onGotoSignup = () => { dispatch("gotoSignup"); };
</script>

<style lang="scss"></style>

<div>
  <Text size="xlg">Sign in</Text>
  <br/>
  <Form on:submit={onSignin}>
    <Input placeholder="Username" maxlength={12} bind:value={$authStore.signinForm.username}/>
    <Input placeholder="Password" type="password" maxlength={32} bind:value={$authStore.signinForm.password}/>
    <Button type="submit">SIGN IN</Button>
  </Form>
  <br/>
  <Text>
    Dont have an account?
    <Text color="purple" isUnderline={true} on:click={onGotoSignup}>
      Sign up
    </Text>
  </Text>
</div>
