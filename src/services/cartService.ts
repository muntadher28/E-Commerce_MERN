import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface createCartForUser {
    userId: any;
}

const createCartForUser = async ({ userId, }: createCartForUser) => {
    const cart = await cartModel.create({ userId, totalAmount: 0 })
    await cart.save();
    return cart;
}

interface getActiveCartForUser {
    userId: any;
}

export const getActiveCartForUser = async ({ userId,}: getActiveCartForUser) => {
    let cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart) {
        cart = await createCartForUser({ userId });
    }
    return cart;
};

interface addItemToCart {
    userId: string;
    productId: any;
    quantity: number;
}

export const addItemToCart = async ({ userId, productId, quantity }: addItemToCart) => {
    const cart = await getActiveCartForUser({ userId });

    //Does the item already exist in the cart?
const existsInCart = cart.items.find(p => p.product.toString() === productId);

    if (existsInCart) {
return {data: "Item already exists in the cart", statusCode: 400};
    }

    //Fetch the product
    const product = await productModel.findById(productId);

    if (!product) {
        return { data: "Product not found!", statusCode: 400 };
    }

    if (product.stock < quantity) {
        return { data: "Low stock for the item", statusCode: 400 };
    }
    cart.items.push({
        product: productId,
        quantity,
        unitPrice: product.price,
    });

    cart.totalAmount += product.price * quantity;

    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
};


interface updatItemInCart {
    userId: string;
    productId: any;
    quantity: number;
}


export const updateItemInCart = async ({ userId, productId, quantity }: updatItemInCart) => {
        const cart = await getActiveCartForUser({ userId });
        const existsInCart = cart.items.find(p => p.product.toString() === productId);

        if (!existsInCart) {
    return {data: "Item does not exist in the cart", statusCode: 400};
        }

            const product = await productModel.findById(productId);

            if (!product) {
               return { data: "Product not found!", statusCode: 400 };
           }

            if (product.stock < quantity) {
        return { data: "Low stock for the item", statusCode: 400 };
    }



    
    const otherCartItems = cart.items.filter(p => p.product.toString() !== productId);
    
    let total = otherCartItems.reduce((sum, item) => {
        sum + (item.unitPrice * item.quantity);
        return sum;
    }, 0);
    
    existsInCart.quantity = quantity;
        total += existsInCart.unitPrice * existsInCart.quantity;

          cart.totalAmount = total;
        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 200 };
};