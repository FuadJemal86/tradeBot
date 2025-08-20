const { PostProduct } = require("../../model/validation");
const prisma = require("../../prisma");



const postProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, quantity } = req.body

        const validate = PostProduct.validate(req.body)
        if (validate.error) {
            console.log(validate.error)
            return res.status(400).json({ message: validate.error.details[0].message });
        }

        const images = req.filePaths || [];

        const product = await prisma.product.create({
            data: {
                name,
                description,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                image1: images[0] || null,
                image2: images[1] || null,
                image3: images[2] || null,
                image4: images[3] || null,

                // Foreign keys
                category: {
                    connect: { id: parseInt(category_id) },
                },
                trader: {
                    connect: { id: 1 }, // or req.body.trader_id
                },
            },
        });


        const id = product.id

        const priceData = {
            product_id: id,
            price: parseFloat(price)
        }

        await prisma.product_Price.create({ data: priceData })


        return res.status(200).json({ status: true, message: 'product posted successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network error." });
    }
}


// getProducts

const getProduct = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            select: {
                name: true,
                quantity: true,
                description: true,
                image1: true,
                image2: true,
                image3: true,
                image4: true,
                product_price: {
                    select: {
                        price: true
                    }
                },
                trader: {
                    select: {
                        location: true
                    }
                },
                rate: {
                    select: {
                        rate: true
                    }
                }
            }
        })

        if (products.length === 0) {
            return res.status(404).json({ status: false, message: 'No Product Found' })
        }

        return res.status(200).json({ status: true, products })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'network error' })

    }
}

module.exports = { postProduct, getProduct }