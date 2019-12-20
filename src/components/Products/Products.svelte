<script>
  // import { onMount, onDestroy } from "svelte";
  import products from "../../stores/defaultProducts";
  import Product from "./Product.svelte";
  import Loading from "../Loading.svelte";

  export let title = "";

  // let localProducts = [];
  // let unsubscribe;

  // onMount(() => {
  //   unsubscribe = products.subscribe(value => {
  //     localProducts = value;
  //   });
  // });

  // onDestroy(() => {
  //   unsubscribe();
  // });
</script>

<section class="section">
  <h2 class="section-title">{title}</h2>
  <div class="products-center">
    <!-- {#each localProducts as product} -->
    {#each $products as product (product.id)}
      <Product {product} />
    {:else}
      <Loading />
    {/each}
  </div>
</section>
