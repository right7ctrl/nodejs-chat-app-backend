const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userData = decodedToken;
            next();

    } catch (e) {
        console.log(e);
        return res.status(401).send({
            message: 'Auth failed',
            err: e
        });
    }


}
module.exports = authMiddleware;