import productModel from "../models/productModel";

export const getAllProducts = async () =>{
    return await productModel.find();
};

export const seedInitialProducts = async () => {
    try {
    const products =[
        {title: "Dell Laptob", image: "https://www.dell.com/wp-uploads/2024/01/XPS-9640-laptops-back-to-back-1280x800-1.jpg", price:350, stock:100 },
    ];

    const existingProducts = await getAllProducts();

    if(existingProducts.length === 0) {
        await productModel.insertMany(products)
    }
    } catch (err) {
        console.error("Cannot seed database: ", err);
    }
};