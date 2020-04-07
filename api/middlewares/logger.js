const logger = (req, res, next) => {
    //console.log(req.params);
    //console.log(req.headers);
    //console.log(req.body);
    next()
}

module.exports = logger;