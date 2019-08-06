import createBadRequestHandler from '../util/bad-request.handler';

const handleInvalidVersion = createBadRequestHandler(
  'Bad request: invalid API version specified.'
);

const rewritePath = (request, version, next) => {
  request.url = `/v${version}` + request.originalUrl;
  next();
};

/*
 * This middleware modifies the request URL by prefixing a version before the
 * path to delegate to a endpoint's handler of different versions, depending on
 * the given Content-Type.
 *
 * For example, if the Content-Type header has the custom media type string
 * `application/vnd.uclcssa.v1+json`, then if the path is `/logout`, it will
 * become `/v1/logout` - where the v1 /logout route handler shall be mounted.
 *
 * If no Content-Type is supplied, by default the latest version is used.
 *
 * If an invalid Content-Type is supplied, a 400 Bad Request will be returned.
 */
const createVersioningDispatcher =
  validMajorVersions => defaultMajorVersion => (request, response, next) => {
  // If no Content-Type is specified, i.e. no version is specified, we shall
  // use the default version and in JSON format.
    if (!request.header('Content-Type')) {
    // We rewrite the path to include a `/v1/` prefix.
      rewritePath(request, defaultMajorVersion, next);
      return;
    }

    // If there is a specified Content-Type, we try to parse it to extract the
    // version information.
    const contentType = request.header('Content-Type');

    const versionedMediaTypeRegex =
      /application\/vnd\.uclcssa\.v(?<version>\d+)\+json/;

    const match = contentType.match(versionedMediaTypeRegex);

    if (!match) {
      rewritePath(request, defaultMajorVersion, next);
      return;
    }

    const suppliedVersion = parseInt(match.groups.version, 10);

    // If supplied version is a valid version, we write path accordingly.
    // Otherwise, we return 400 Bad Request.
    if (validMajorVersions.includes(suppliedVersion)) {
      rewritePath(request, suppliedVersion, next);
    } else {
      handleInvalidVersion(response, next);
    }
  };

export default createVersioningDispatcher;
