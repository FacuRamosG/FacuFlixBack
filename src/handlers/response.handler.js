const responseWithData = (res, statusCode, data) => {
  res.status(statusCode).json(data)
  // res.writeHead(statusCode)
  // res.end(data.message)
}

const error = (res) => responseWithData(res, 500, {
  status: 500,
  message: ':S somthing go worng'
})

const badresquest = (res, message) => responseWithData(res, 400, {
  status: 400,
  message
})

const ok = (res, data) => responseWithData(res, 200, data)

const created = (res, data) => responseWithData(res, 201, data)

const unauthorize = (res) => responseWithData(res, 401, {
  status: 401,
  message: 'No authorizes'
})

const notfound = (res) => responseWithData(res, 404, {
  status: 404,
  message: 'Not found'
})

export default {
  error,
  badresquest,
  ok,
  created,
  unauthorize,
  notfound
}
