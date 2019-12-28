<script>
  import { onMount } from "svelte";
  import { navigate, link } from "svelte-routing";
  import user from "../stores/user";
  import cart, { cartTotal } from "../stores/cart";
  import submitOrder from "../strapi/submitOrder";
  import globalStore from "../stores/globalStore";

  let name = "";

  // stipe vars
  let cardElement;
  let cardErrors;
  let card;
  let stripe;
  let elements;

  $: isEmpty = !name || $globalStore.alert;

  onMount(() => {
    if (!$user.jwt) {
      navigate("/");
      return;
    }

    if ($cartTotal > 0) {
      stripe = Stripe("pk_test_PZr10y21EaSKIn2dJVBiVFZb0097rHh3FP");
      elements = stripe.elements();
      card = elements.create("card");
      card.mount(cardElement);
      card.addEventListener("change", function(event) {
        if (event.error) {
          cardErrors.textContent = event.error.message;
        } else {
          cardErrors.textContent = "";
        }
      });
    }
  });

  async function handleSubmit() {
    globalStore.toggleItem("alert", true, "Submitting order... please wait!");
    let response = await stripe
      .createToken(card)
      .catch(error => console.log(error));

    const { token } = response;

    if (token) {
      const { id } = token;
      let order = await submitOrder({
        name,
        total: $cartTotal,
        items: $cart,
        stripeTokenId: id,
        userToken: $user.jwt
      });

      if (order) {
        globalStore.toggleItem("alert", true, "Your order is complete!");
        cart.set([]);
        localStorage.setItem("cart", JSON.stringify([]));
        navigate("/");
        return;
      } else {
        globalStore.toggleItem(
          "alert",
          true,
          true,
          "there was an error with your order. Please try again"
        );
      }

      // token.id
      // submit the order
    } else {
    }
  }
</script>

{#if $cartTotal > 0}
  <section class="form">
    <h2 class="section-title">Checkout</h2>
    <form class="checkout-form" on:submit|preventDefault={handleSubmit}>
      <h3>Order total: ${$cartTotal}</h3>
      <!-- single input -->
      <div class="form-control">
        <label for="name">Your name</label>
        <input type="text" id="name" bind:value={name} />
      </div>
      <!-- end of single input -->
      <!-- stripe stuff -->
      <div class="stripe-input">
        <!-- info -->
        <label for="card-element">Credit or Debit Card</label>
        <p class="stripe-info">
          Test using this credit card:
          <span>4242 4242 4242 4242</span>
          <br />
          Enter any 5 digits for the zip code
          <br />
          Enter any 3 digits for the CVC
        </p>
        <div id="card-element" bind:this={cardElement}>
          <!-- stripe -->
        </div>
        <div id="card-errors" bind:this={cardErrors} role="alert" />
      </div>
      <!-- end of stripe stuff -->
      <!-- error message -->
      {#if isEmpty}
        <p class="form-empty">Please fill out name field</p>
      {/if}
      <!-- submit button -->
      <button
        type="submit"
        class="btn btn-block btn-primary"
        disabled={isEmpty}
        class:disabled={isEmpty}>
        Submit
      </button>
    </form>
  </section>
{:else}
  <div class="checkout-empty">
    <h2>Your cart is empty</h2>
    <a href="/products" use:link class="btn btn-primary">Fill it</a>
  </div>
{/if}
