export function validationAnswerData(req, res, next) {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            message: "Invalid request data.",
        })
    }

    if (!body.content) {
        return res.status(400).json({
            message: "Content is required.",
        })
    } else if (body.content.length > 300) {
        return res.status(400).json({
            message: "Content is too long. Maximum allowed length is 300 characters.",
        })
    }

    next();
}