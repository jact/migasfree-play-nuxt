const express = require('express')
const app = express()

const packagesRouter = require('./routes/packages')
const preferencesRouter = require('./routes/preferences')
const computerRouter = require('./routes/computer')
const tokenRouter = require('./routes/token')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/packages', packagesRouter)
app.use('/preferences', preferencesRouter)
app.use('/computer', computerRouter)
app.use('/token', tokenRouter)

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

let server = app.listen(3000, () => {
  console.log('Express server listening on port ' + '3000')
})

module.exports = app
