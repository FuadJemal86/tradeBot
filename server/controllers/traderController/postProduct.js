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

        const data = {
            name,
            description,
            category_id: parseInt(category_id),
            quantity: parseInt(quantity),
            image1: images[0] || null,
            image2: images[1] || null,
            image3: images[2] || null,
            image4: images[3] || null,
            price: parseFloat(price)

        };

        const product = await prisma.product.create({ data: data })

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

module.exports = { postProduct }