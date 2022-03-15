<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {cryptoService, eccService, socketService} from "services";
  import {authStore} from "auth/stores";

  import Button from "../ui/Button.svelte";
  import Form from "../ui/Form.svelte";
  import Input from "../ui/Input.svelte";
  import Text from "../ui/Text.svelte";

  const dispatch = createEventDispatcher();

  const onSignup = async (): Promise<void> => {
    const {username, password} = $authStore.signupForm;
    const privateKey = await eccService.randomKey();
    const publicKey = eccService.toPublic(privateKey);
    const privateKeyHash = cryptoService.encrypt(privateKey, password);

    socketService.signup({username, publicKey, privateKeyHash});
  };

  const onGotoSignin = (): void => { dispatch("gotoSignin"); };
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  form {
    width: 320px;
    margin-bottom: $spacing-md;
  }
  span {
    cursor: pointer;
  }
  .form__btn {
    display: flex;
    justify-content: center;
  }
</style>

<div>
  <Text size="lg">Sign up</Text>

  <Form>
    <Input placeholder="Username" maxlength={12} bind:value={$authStore.signupForm.username}/>
    <Text>a-z 1-5 . (12 chars)</Text>
    <Input placeholder="Password" type="password" maxlength={32} bind:value={$authStore.signupForm.password}/>
    <Button on:click={onSignup}>SIGN UP</Button>
  </Form>

  <Text>
    Already have an account?
    <Text color="purple" isUnderline={true} on:click={onGotoSignin}>Sign in</Text>
  </Text>
</div>
