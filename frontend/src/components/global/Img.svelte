<script lang="ts">
  let src: string;
  let alt: string;

  export {src, alt};
</script>

<style lang="scss">
  img {
    display: block;
    // vertical-align: middle;
  }
</style>

<img src={`assets/${src}`} {alt}/>
