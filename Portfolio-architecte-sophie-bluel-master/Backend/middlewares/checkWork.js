module.exports = (req, res, next) => {
	try{
		const host = req.get('host');
		console.log(req.file.filename);
		const title = req.body.title.trim() ?? undefined;
		const categoryId = req.body.category ?? undefined;
		const userId = parseInt(req.auth.userId) ?? undefined;
		//req.file.filename doesnt fucking EXISSSSSSSSSSTTTTTTTTTTTT !!!!!!!!!!!!!!!!!!!!!!!!!!
		const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
		console.log(title,categoryId,userId,imageUrl)
		if(title !== undefined &&
			title.length > 0 &&
			categoryId !== undefined &&
			categoryId > 0 &&
			userId !== undefined &&
			userId > 0 &&
			imageUrl){
			req.work = {title, categoryId, userId, imageUrl}
			console.log(req.work)
			next()
		}else{
			console.log('sueeeer')
			return res.status(400).json({error: new Error("Bad Request")})
		}
	}catch(e){
		//console.log('sue');
		return res.status(500).json({error: new Error("Something wrong occurred")})
	}

}
