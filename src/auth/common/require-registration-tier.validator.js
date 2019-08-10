import config from '../../config/config';

import createRegistrationTierValidator
  from './helpers/create-registration-tier.validator';
import findUserSession
  from './helpers/find-user-session-by-session-key';

const expirationTimeS = config.get('uclcssaSessionKeyExpirationTimeS');

const requireRegistrationTier = createRegistrationTierValidator(findUserSession)(expirationTimeS);

export default requireRegistrationTier;
