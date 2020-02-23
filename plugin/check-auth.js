import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    // console.log(decoded)
    next()
  } catch (err) {
    // console.log(err)
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}