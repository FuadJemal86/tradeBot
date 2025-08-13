const Joi = require('joi')



const Sign_up = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    location: Joi.string().required(),
});


module.exports = {
    Sign_up
}
