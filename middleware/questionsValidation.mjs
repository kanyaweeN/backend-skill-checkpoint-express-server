export function validationQuestionsData(req, res, next) {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            message: "Invalid request data.",
        })
    }

    if (!body.title) {
        return res.status(400).json({
            message: "Title is required.",
        })
    }

    if (!body.description) {
        return res.status(400).json({
            message: "Description is required.",
        })
    }

    if (!body.category) {
        return res.status(400).json({
            message: "Category is required.",
        })
    }

    next();
}

export function validationQuestionsAnswerData(req, res, next) {
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
    }

    next();
}