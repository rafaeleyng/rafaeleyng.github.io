import dateformat from 'dateformat'

export const dateMachine = (date) => dateformat(date, 'yyyy-mm-dd')

export const dateHuman = (date) => dateformat(date, 'mmm d, yyyy')
