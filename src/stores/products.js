import { writable, derived } from "svelte/store";
import url from "../strapi/URL";
import getProducts from "../strapi/getProducts";

const store = writable([], () => {
  serProducts();
  return () => {};
});

async function serProducts() {
  let products = await getProducts();
  if (products) {
    products = flattenProducts(products);
    store.set(products);
  }
}

// subscribe
// set
// update

// flatten products
function flattenProducts(data) {
  return data.map(item => {
    // let image = item.image.url;
    let image = `${url}${item.image.url}`;
    return {...item, image};
  });
}

// featured store (derived)
export const featuredStore = derived(store, ($featured) => {
  return $featured.filter(item => item.featured === true);
});

export default store;