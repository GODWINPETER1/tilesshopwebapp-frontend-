import { cartAPI } from './services/api';

export const testCart = async () => {
  try {
    const response = await cartAPI.getCart();

    console.log('🛒 CART RESPONSE:', response.data);

    console.log(
      'Cart:',
      response.data.data?.cart
    );

    console.log(
      'Items:',
      response.data.data?.items
    );

  } catch (error) {
    console.error(
      '❌ CART ERROR:',
      error
    );
  }
};