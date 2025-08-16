const Joi = require('joi')


// sign up
const Sign_up = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    location: Joi.string().required(),
});

// post product

const PostProduct = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    quantity: Joi.number().required(),
});


module.exports = {
    Sign_up,
    PostProduct
}
