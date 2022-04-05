<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {cryptoService, eccService, socketService} from "services";
  import {authStore} from "stores";
  import {Button, Form, Input, Text} from "ui";

  const dispatch = createEventDispatcher();

  const onSignup = async () => {
    const {username, password} = $authStore.signupForm;
    const privateKey = await eccService.randomKey();
    const publicKey = eccService.toPublic(privateKey);
    const privateKeyHash = cryptoService.encrypt(privateKey, password);

    socketService.socket.emit("signup", {username, publicKey, privateKeyHash});
  };

  const onGotoSignin = () => { dispatch("gotoSignin"); };
</script>

<style lang="scss"></style>

<div>
  <Text size="lg">Sign up</Text>
  <Form>
    <Input
      placeholder="Username"
      maxlength={12}
      bind:value={$authStore.signupForm.username}/>
    <Text>a-z 1-5 . (12 chars)</Text>
    <Input
      placeholder="Password"
      type="password"
      maxlength={32}
      bind:value={$authStore.signupForm.password}/>
    <Button on:click={onSignup}>SIGN UP</Button>
  </Form>
  <Text>
    Already have an account?
    <Text color="purple" isUnderline={true} on:click={onGotoSignin}>
      Sign in
    </Text>
  </Text>
</div>
