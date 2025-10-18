import { Router } from 'express'

import {
	apiMovieController,
	apiMovieDataController,
	apiMovieGetIdsController,
	apiTvController,
	apiTvDataController,
	apiTvGetIdsController,
} from '../controllers'

const router = Router()

router.get('/movie/getIds', apiMovieGetIdsController)
router.get('/tv/getIds', apiTvGetIdsController)
router.get('/movie/data', apiMovieDataController)
router.get('/tv/data', apiTvDataController)
router.get('/movie', apiMovieController)
router.get('/tv', apiTvController)

export default router
