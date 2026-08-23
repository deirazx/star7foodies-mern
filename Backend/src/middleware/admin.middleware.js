const Admin = (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            next()
        } else {
            res.status(401).json({ message: "Admin only" })
        }
    } catch (error) {
        console.log("Admin error");
        res.status(401).json({ message: "Admin error" });
    }
}

module.exports = { Admin };