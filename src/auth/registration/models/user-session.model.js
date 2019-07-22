import mongoose from 'mongoose';

import userSessionSchema from '../schemas/user-session.schema';

const UserSession = mongoose.model('UserSession', userSessionSchema);

export default UserSession;
