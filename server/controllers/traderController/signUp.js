
const bcrypt = require('bcrypt')
const prisma = require('../../prisma')
const { Sign_up } = require('../../model/validation')



const signUp = async (req, res) => {

    try {
        const { fullName, email, password, phone, location } = req.body

        const validate = Sign_up.validate(req.body)
        if (validate.error) {
            return res.status(400).json({ message: validate.error.details[0].message });
        }

        const checkExist = await prisma.trader.findFirst({
            where: { email: email }
        })

        if (checkExist) {
            return res.status(200).json({ status: false, message: 'this user already exist' })
        }

        const hash = await bcrypt.hash(password, 10)

        const data = {
            fullName: fullName,
            email: email,
            password: hash,
            phone: phone,
            location: location
        }

        await prisma.trader.create({ data })

        return res.status(200).json({ status: true, message: 'Registered Successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network error." });
    }
}

module.exports = { signUp }