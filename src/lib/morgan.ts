import * as moment from 'moment-timezone'
import morgan from 'morgan'

const timezone = process.env.TZ ?? 'Asia/Tokyo'

morgan.token('date', () => {
  return moment.tz(timezone).format()
})

morgan.format(
  'fmt',
  `:remote-addr - :remote-user [:date[${timezone}]] ` +
    '":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":referrer" ":user-agent"',
)

const middleware = morgan('combined')

export { middleware as morgan }
