const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, 'thisIsMySecretKey')
		const userId = decodedToken.userId
		req.auth = { userId }
		console.log('req.body.userId : ' + req.body.userId);
		console.log(userId);
		if (req.body.userId && String(req.body.userId) !== String(userId) ) {
			console.log('invalid fucking userId');
			throw 'Invalid user ID'
		} else {
			next()
		}
	} catch {
		console.log('fuck it fuck it fuck it')
		res.status(401).json({
			error: new Error('You are not authenticated')
		})
	}
}
