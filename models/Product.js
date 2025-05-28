import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand:{
      type:String,
      default:'Pilley'
    },
    offerPrice: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    size: {
        type: [String], 
        required: true
    },
    color: {
        type: [String], // e.g., ["Red", "Black", "White"]
        required: true
    },
    material: {
        type: String, // e.g., "Cotton", "Polyester"
        required: true
    },
    date: {
        type: Number,
        required: true

    }

}, { minimize: false })


const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
