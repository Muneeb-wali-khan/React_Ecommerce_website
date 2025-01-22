const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide product name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please provide product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please provide product stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
    }
    ,
    numOfReviews: {
        type: Number,
        default: 0,

    },

    reveiws: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true,
            },

            username: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now, // Use a function to get the current date and time
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    },

    creattAt: {
        type: Date,
        default: Date.now,
    }
})


module.exports = mongoose.model("products", ProductSchema);