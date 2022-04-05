<script lang="ts"></script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  form {
    width: 320px;
    @include flex(column, center);
  }
</style>

<form on:submit|preventDefault>
  <slot/>
</form>
