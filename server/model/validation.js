import { join } from '../generated/prisma/runtime/library'
import Joi from 'joi';


const Sign_up = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    location: Joi.string().valid("ADMIN", "CASHIER").required(),
});


module.export = {
    Sign_up
}