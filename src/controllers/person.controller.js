import responseHandler from '../handlers/response.handler.js'
import tmdbApi from '../tmdb/tmdb.api.js'

const personDetail = async (req, res) => {
  try {
    const { personId } = req.params
    const person = await tmdbApi.personDetail({ personId })

    responseHandler.ok(res, person)
  } catch {
    responseHandler.error(res)
  }
}

const personMedias = async (res, req) => {
  try {
    const { personId } = req.req.params

    const medias = await tmdbApi.personMedia({ personId })

    responseHandler.ok(res.res, medias)
  } catch {
    responseHandler.error(res.res)
  }
}

export default { personDetail, personMedias }
