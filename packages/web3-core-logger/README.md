<p align="center">
  <img src="../../assets/logo/web3js.jpg" width="200" alt="web3.js" />
</p>

# web3.js - Logger

## Installation

```bash
yarn add web3-core-logger
```

## Package.json Scripts

-   `build`: Runs `yarn clean` and `yarn compile`
-   `clean`: Uses `rimraf` to remove `lib/` and `buildcache/`
-   `compile`: Uses `tsc` to build package and depedenent packages
-   `lint`: Uses `prettier` and `eslint` to lint package
-   `lint:check`: Uses prettier and `eslint` to check if package has been linted
-   `test`: Uses `jest` to run all tests
-   `test:integration`: Uses `jest` to run tests under `/test/integration`
-   `test:unit`: Uses `jest` to run tests under `/test/unit`

## How to Use

### Configuring Your Package

A package that utilizes `web3-core-logger` requires the following:

- `_version.ts` This specifies the version of the package you're adding the logger to
  - This is included an error messages
  - File should look like:
  ```javascript
  export default '1.0.0';
  ```
- `errors.ts` Config file the specifies errors related to your package
  - Should look similar to:
  ```javascript
  import { Web3Error } from './types';

  export enum CoreErrorNames {
      unsupportedError = 'unsupportedError',
      duplicateErrorName = 'duplicateErrorName',
      failedToCreateErrorString = 'failedToCreateErrorString',
  }

  export const CoreErrors: Record<CoreErrorNames, Web3Error> = {
      unsupportedError: {
          code: 1,
          name: 'unsupportedError',
          msg: 'Provided error does not exist in CoreErrors or provided Web3PackageErrorConfig',
      },
      duplicateErrorName: {
          code: 2,
          name: 'duplicateErrorName',
          msg: 'Error defined in Web3PackageErrorConfig.errors has the same name as an error in CoreErrors',
      },
      failedToCreateErrorString: {
          code: 3,
          name: 'failedToCreateErrorString',
          msg: 'Unable to create error string for unknown reason',
      },
  };
  ```

### Creating Errors

You should import the `enum` of error names that is specified in `errors.ts`, in the above code that would be `CoreErrorNames`. Using an `enum` standardizes the error selection process when using the logger to create errors

To create an error using the logger, use the `Web3CoreLogger.makeError` method. The parameters for this method are:

- `web3ErrorName` This is one of names specified in the `enum` mentioned above
- `errorDetails` An optional parameters that allows you to pass configurable details such as:
  - `reason` A `string` that you can add additional context to from the method that's creating the error
  - `params` An `object` that specifies the name of parameters and the corresponding values that have been passed to the method creating the error

Putting all this together looks like:

```javascript
import Web3CoreLogger from 'web3-core-logger';
import {
    MyErrorsConfig,
    MyErrorNames,
} from './errors';

const logger = new Web3CoreLogger(MyErrorsConfig);

function myFunc(arg1: string) {
  try {
    if (typeof arg1 !== 'string')
      throw logger.makeError(
        MyErrorNames.invalidArgumentType,
        {
          reason: 'arg1 has not of type string',
          params: { arg1 }
        }
      )
  } catch (error) {
    throw error;
  }
}
```
