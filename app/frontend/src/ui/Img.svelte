<script lang="ts">
  let src: string;
  let alt: string;

  export {src, alt};
</script>

<style lang="scss">
  img {display: block}
</style>

<img src={`assets/${src}`} {alt}/>
