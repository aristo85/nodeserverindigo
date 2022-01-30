
exports.privateData = async (req, res, next) => {

    try {
        // some async request
        res.status(200).json({ message: "authorized data" })
        

    } catch (error) {
        error.statusCode = 500
        next(error)
    }
}