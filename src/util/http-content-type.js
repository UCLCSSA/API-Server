import version from '../versioning/version';

// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type.
const ContentType = {
  HTML_UTF8: 'text/html; charset=utf-8',
  JSON: `application/vnd.uclcssa.v${version.MAJOR}+json`
};

export default ContentType;
