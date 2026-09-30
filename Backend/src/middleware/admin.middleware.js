/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user possesses the 'admin' role.
 * Responds with HTTP 403 Forbidden if the user is authenticated but not an admin.
 */
const Admin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in first."
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access forbidden: Requires administrator privileges."
            });
        }

        next();
    } catch (error) {
        console.error("Admin authorization error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authorization check."
        });
    }
};

module.exports = { Admin };