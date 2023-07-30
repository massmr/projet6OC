const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;

exports.signup = async (req, res) => {
	if(!req.body.email || !req.body.password){
		return res.status(400).send({
			message: "Must have email and password"
		});
	}
	try{
		const hash = await bcrypt.hash(req.body.password, 10)
		const user = {
			email: req.body.email,
			password: hash
		}
		await Users.create(user)
		return res.status(201).json({message: 'User Created'})
	}catch (err){
		return res.status(500).send({
			message: err.message
		});
	}

}

exports.login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required." });
	}

	try {
		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ message: "Invalid password." });
		}

		return res.status(200).json({
			userId: user.id,
			token: jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {
				expiresIn: "24h",
			}),
		});
	} catch (err) {
		return res.status(500).json({ message: "Internal server error." });
	}
};