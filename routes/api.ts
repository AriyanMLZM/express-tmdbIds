import { Router } from 'express'

import { apiMovieGetIdsController, apiTvGetIdsController } from '../controllers'

const router = Router()

router.get('/movie/getIds', apiMovieGetIdsController)
router.get('/tv/getIds', apiTvGetIdsController)

export default router
