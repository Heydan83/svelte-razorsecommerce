<script>
  import Hero from "../components/Hero.svelte";
  import { Link, link } from "svelte-routing";

  // feature products
  import Featured from "../components/Products/Featured.svelte";

  // function getProps(){
  //   return { class:"btn btn-primary btn-hero" }
  // }
</script>

<Hero>
  <!-- <Link to="/products" getProps={getProps}>Shop now</Link> -->
  <a href="/products" class="btn btn-primary btn-hero" use:link>Shop now</a>
</Hero>
<Featured title="Feature Products"/>