# JsonWebToken(JWT) with node express example
> Examples of simple JWT authentication that was using the expresssequelize

## How to use

### require

- NodeJs
- Docker (using Docker compose)

### start

```sh
$ docker compose up -d

# create user
$ curl -X POST http://127.0.0.1:3000/user -d 'name=testuser' -d 'password=secretpassword'
{"id":2,"name":"testuser","password":"secretpassword","updated_at":"2016-08-03T14:02:08.000Z","created_at":"2016-08-03T14:02:08.000Z"}

# user authenticate ( create jwt )
$ curl -X POST http://127.0.0.1:3000/authentication -d 'name=testuser' -d 'password=secretpassword'
{"token":"CREATED-JSON-WEB-TOKEN","message":"Authentication successfully finished."}%

# login another host ( with JWT )
# how to pass jwt
#   - post jwt or
#   - http header with x-access-token or
#   - url query access_token
$ curl -X POST http://127.0.0.1:8000/login -d 'access_token=CREATED-JSON-WEB-TOKEN"'
{"id":2,"name":"testuser"}
```

### other

npm scripts

```sh
# spec test
$ npm test

# migration
$ npm run test

# db seeds
$ npmr run seed
```
