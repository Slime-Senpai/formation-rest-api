import { NextFunction, Request, Response } from 'express';

/**
 * Lets you check if the id in the request param is a number
 *
 * @param req The express request
 * @param res The express response
 * @param next The next function
 * @returns Bad Request is the id is not a number
 */
export function checkId(req: Request, res: Response, next: NextFunction) {
	// We try to parse the id as a number, if it's not a number then we shouldn't continue
	if (Number.isNaN(+req.params.id)) {
		return res.status(400).json({ message: 'Bad request' });
	}

	next();
}
