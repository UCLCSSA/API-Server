import moment from 'moment';

// Current datetime in mysql format.
const currentDateTime = () =>
  moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

export default currentDateTime;
