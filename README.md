# UCLCSSA API Server

## Description

This API server uses [Nest.js](https://github.com/nestjs/nest).

## Setup

### Installing dependencies

```bash
$ yarn install
```

### Database

Configure database connections by creating a file called `ormconfig.json` for TypeORM. MySQL is assumed to be the database.

Begin by copying the example config:

```bash
$ cp ormconfig.example.json ormconfig.json
```

### Configuration

Configuration can be specified by creating a Node env file for the desired node environment. `NODE_ENV` can either be

- `development`, or
- `production`.

Begin by copying the example env (and changing `NODE_ENV` as desired):

For development:
```bash
$ export NODE_ENV=development && cp example.env $NODE_ENV.env
```

For production:
```bash
$ export NODE_ENV=production && cp example.env $NODE_ENV.env
```

## Issuing self-signed certificate for development

See:

 - [ssl/README.md](ssl/README.md).
 - [Let's Encrypt Guide](https://letsencrypt.org/docs/certificates-for-localhost/).

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

  This project is [MIT licensed](LICENSE).
