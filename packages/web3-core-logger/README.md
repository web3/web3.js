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

-   `_version.ts` This specifies the version of the package you're adding the logger to
    -   This is included in error messages
    -   File should look like:
    ```typescript
    export default '1.0.0';
    ```
-   `errors.ts` Config file the specifies errors related to your package

    -   Should look similar to:

    ```typescript
    import {
        Web3Error,
        Web3PackageErrorConfig,
    } from 'web3-core-logger/src/types';
    import packageVersion from './_version';

    export enum Web3ProvidersHttpErrorNames {
        invalidClientUrl = 'invalidClientUrl',
        noHttpClient = 'noHttpClient',
        connectionRefused = 'connectionRefused',
    }

    interface Web3ProvidersHttpErrorsConfig extends Web3PackageErrorConfig {
        errors: Record<Web3ProvidersHttpErrorNames, Web3Error>;
    }

    export const Web3ProvidersHttpErrorsConfig: Web3ProvidersHttpErrorsConfig =
        {
            packageName: 'web3-providers-http',
            packageVersion,
            errors: {
                invalidClientUrl: {
                    code: 1,
                    name: 'invalidClientUrl',
                    msg: 'Provided web3Client is an invalid HTTP(S) URL',
                },
                noHttpClient: {
                    code: 2,
                    name: 'noHttpClient',
                    msg: 'No HTTP client has be initialized',
                },
                connectionRefused: {
                    code: 3,
                    name: 'connectionRefused',
                    msg: 'Unable to make connection with HTTP client',
                },
            },
        };
    ```

### Creating Errors

You should import the `enum` of error names that is specified in `errors.ts`, in the above code that would be `CoreErrorNames`. Using an `enum` standardizes the error selection process when using the logger to create errors

To create an error using the logger, use the `Web3CoreLogger.makeError` method. The parameters for this method are:

-   `web3ErrorName` This is one of names specified in the `enum` mentioned above
-   `errorDetails` An optional parameter that allows you to pass configurable details such as:
    -   `reason` A `string` that you can add additional context to from the method that's creating the error
    -   `params` An `object` that specifies the name of parameters and the corresponding values that have been passed to the method creating the error

Putting all this together looks like:

```typescript
import Web3CoreLogger from 'web3-core-logger';

import {
    Web3ProvidersHttpErrorsConfig,
    Web3ProvidersHttpErrorNames,
} from './errors';

// Class is simplified for the sake of this usage example
export default class Web3ProvidersHttp {
    private _logger: Web3CoreLogger;

    constructor(web3Client: string) {
        this._logger = new Web3CoreLogger(Web3ProvidersHttpErrorsConfig);
        this._validateClientUrl(web3Client);
    }

    /**
     * Determines whether {web3Client} is a valid HTTP client URL
     *
     * @param web3Client To be validated
     * @returns true if valid
     */
    private _validateClientUrl(web3Client: Web3Client) {
        try {
            if (
                typeof web3Client === 'string' &&
                /^http(s)?:\/\//i.test(web3Client)
            )
                return;

            throw this._logger.makeError(
                Web3ProvidersHttpErrorNames.invalidClientUrl,
                {
                    params: { web3Client },
                }
            );
        } catch (error) {
            throw error;
        }
    }
}
```

The above would produce an error message as such:

```typescript
loggerVersion: 1.0.0
packageName: web3-providers-http
packageVersion: 4.0.0-alpha.0
code: 1
name: invalidClientUrl
msg: Provided web3Client is an invalid HTTP(S) URL
params: {"web3Client":{}}
```
