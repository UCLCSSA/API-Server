import semver from 'semver';

import { version } from '../../package.json';

const versionInfo = {
  MAJOR: semver.major(version),
  MINOR: semver.minor(version),
  MAJOR_VERSION: semver.patch(version)
};

export default versionInfo;
