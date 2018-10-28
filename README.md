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
