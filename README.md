# lexical-density-checker
RESTful API that calculate the lexical density from input text.

## Table of Contents

- [Development Installation](#Development%20Installation)
- [Exposed Resources](#Exposed%20Resources)
- [Testing](#Testing)
- [Authors / Contributors](#authors-contributors)

<a name="Development Installation"></a>
## Development Installation

1. Clone the repository:

  ```bash
  $ git clone https://github.com/iShuga139/lexical-density-checker.git
  $ cd lexical-density-checker
  ```

2. Install dependencies:

  ```bash
  $ npm install
  ```

3. Dependencies:
  - MongoDB (required)

4. Run the application:

  ```bash
  $ npm start
  ```

<a name="Exposed Resources"></a>
## Endpoints

### -> /
Home route that provides a friendly message

Request
```bash
$ curl localhost:3000/
```

Response
```bash
Welcome to Lexical Density Checker
```

### -> /non-lexical-word
POST route to add non lexical words to the DB

* Options on body:
  - word (required as string value)

Request
```bash
$ curl -i -X POST "http://localhost:3000/non-lexical-word" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d "{ \"word\": \"on\"}"
```

Response
```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-+habyFCzFNeD+7sP84ZoGN9MYU4"
Date: Sun, 28 Oct 2018 20:59:39 GMT
Connection: keep-alive

{"message":"The word was saved successfully"}
```

### -> /complexity
GET route to calculate the lexical density from the provided input text

* Options on query params:
  - text (required as string value)
  - mode (optional as `verbose` value)

* Options on body:
  - text (required as string value)

*NOTE*: You can send input text as query params (encoded) and as form-urlencoded, if both are presents query params will be chosen

Request 1
```bash
$ curl -i -X GET 'http://localhost:3000/complexity?text=Kim%20loves%20going%20%20to%20the%20%20cinema'
```

Request 2
```bash
$ curl -i -X GET "http://localhost:3000/complexity" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d "{ \"text\": \"Kim loves goind to the cinema\"}"
```

Response
```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 30
ETag: W/"1e-LL+eGJ4umcwDBAGR17V/5UqolXU"
Date: Sun, 28 Oct 2018 23:25:33 GMT
Connection: keep-alive

{"data":{"overall_ld":"0.67"}}
```

Request 3
```bash
$ curl -i -X GET 'http://localhost:3000/complexity?mode=verbose&text=Kim%20loves%20going%20%20to%20the%20%20cinema'
```

Request 4
```bash
$ curl -i -X GET "http://localhost:3000/complexity?mode=verbose" \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d "{ \"text\": \"Kim loves goind to the cinema\"}"
```

Response
```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 53
ETag: W/"35-qRxWJuHajfQY9oHEG69C/1GMP2E"
Date: Sun, 28 Oct 2018 23:29:28 GMT
Connection: keep-alive

{"data":{"overall_ld":"0.67","sentence_ld":["0.67"]}}
```

<a name="Testing"></a>
## Testing

The API Framework uses Mocha as testing framework and Sinon for the external systems simulation. Tests should be written on the tests directory.

To test the API Framework run from the root of the project:

```bash
$ npm test
```

You can get a coverage report using:

```bash
$ npm run coverage
```

You can se the coverage results using:

```bash
$ npm run coverage:open
```

<a name="authors-contributors"></a>
## Authors / Contributors

- **Author:** Jonathan Estrada - <jeaworks@hotmail.com>

- **Contributors:**
