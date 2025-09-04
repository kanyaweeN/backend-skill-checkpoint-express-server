import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validationQuestionsData } from "../middleware/questionsValidation.mjs";
import { validationAnswerData } from "../middleware/answerValidation.mjs";

const questionsRouter = Router();

questionsRouter.post('/', validationQuestionsData, async (req, res) => {
    try {
        const newQuestions = {
            ...req.body,
        }

        await connectionPool.query(
            `
                insert into questions
                    (title,description,category)
                values 
                    ($1,$2,$3)
            `,
            [
                newQuestions.title,
                newQuestions.description,
                newQuestions.category
            ]
        )

        return res.status(201).json({
            message: "Question created successfully.",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to create question.",
        });
    }
});

questionsRouter.post('/:questionId/answers', validationAnswerData, async (req, res) => {
    try {
        const questionId = req.params.questionId;
        let result;
        result = await connectionPool.query(
            `
                select 
                    *
                from 
                    questions
                where 
                    id = $1
            `, [questionId]
        )

        if (!result.rows[0]) {
            return res.status(404).json({
                message: "Question not found.",
            });
        } else {

            const newAnswers = {
                ...req.body,
            }

            result = await connectionPool.query(
                `
                insert into answers
                    (question_id,content)
                values 
                    ($1,$2)
            `,
                [
                    questionId,
                    newAnswers.content
                ]
            )

            return res.status(201).json({
                message: "Answer created successfully",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to create answers.",
        });
    }
});

questionsRouter.get('/', async (req, res) => {
    try {
        let result = await connectionPool.query(
            `
                select 
                    *
                from 
                    questions
            `, []
        )

        return res.status(200).json({
            data: result.rows,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }
});

questionsRouter.get('/search', async (req, res) => {
    try {
        const titleParam = req.query.title ? `%${req.query.title}%` : null;
        const categoryParam = req.query.category ? `%${req.query.category}%` : null;
        console.log(titleParam, categoryParam);

        let result = await connectionPool.query(
            `
                select 
                    *
                from 
                    questions
                where 
                    (title ilike $1 or $1 is null)
                    and
                    (category ilike $2 or $2 is null)
            `,
            [
                titleParam,
                categoryParam
            ]
        )

        if (!result.rows[0]) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            data: result.rows,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }
});

questionsRouter.get('/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;

        let result = await connectionPool.query(
            `
                select 
                    *
                from 
                    questions
                where 
                    id = $1
            `, [questionId]
        )

        if (!result.rows[0]) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            data: result.rows[0],
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }
});

questionsRouter.get('/:questionId/answers', async (req, res) => {
    try {
        const questionId = req.params.questionId;

        let result = await connectionPool.query(
            `
                select 
                    answers.*
                from 
                    questions
                    inner join answers ON answers.question_id = questions.id 
                where 
                    questions.id = $1
            `, [questionId]
        )

        if (!result.rows[0]) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            data: result.rows,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to fetch answers.",
        });
    }
});

questionsRouter.put('/:questionId', validationQuestionsData, async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const newQuestions = {
            ...req.body,
        }

        let result = await connectionPool.query(
            `
                update 
                    questions
                set 
                    title = $2,
                    description = $3,
                    category = $4
                where 
                    id = $1
            `,
            [
                questionId,
                newQuestions.title,
                newQuestions.description,
                newQuestions.category
            ]
        )

        if (!result.rows[0]) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            data: result.rows[0],
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }
});

questionsRouter.delete('/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;

        let result = await connectionPool.query(
            `
                delete from
                    questions
                where 
                    id = $1
            `, [questionId]
        )

        if (!result.rowCount === 0) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            message: "Question post has been deleted successfully.",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to delete question.",
        });
    }
});

questionsRouter.delete('/:questionId/answers', async (req, res) => {
    try {
        const questionId = req.params.questionId;

        let result = await connectionPool.query(
            `
                delete from
                    answers
                where 
                    question_id = $1
            `, [questionId]
        )

        if (!result.rowCount === 0) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            message: "All answers for the question have been deleted successfully.",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Unable to delete answers.",
        });
    }
});

export default questionsRouter;