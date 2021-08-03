# cognito-userpool-jwks-query
This is a small AWS CDK library which provides a single construct: `CognitoUserPoolJWKSQuery` which exposes
the JSON Web Key Set for a Cognito User Pool in your CDK script. This is especially useful for serverless applications
which need to verify cognito JWTs. Just pass `CognitoUserPoolJWKSQuery#getJWKS()` as an environment variable in your
lambda function.

## Usage
```ts
import {CognitoUserPoolJWKSQuery} from '..';

class SomeStack extends Stack {
    constructor(scope: Construct) {
        super(scope, 'MyAppStack');
        
        const userPool = new UserPool(this, 'MasterUserPool');
        
        const jwksQuery = new CognitoUserPoolJWKSQuery(this, 'MasterUserPoolJWKSQuery');
        
        new Function(this, 'MyFunction', {
            envrionment: {
                /* String containing the JWKS. Can be deserialized using JSON.parse()) */
                USER_POOL_JWKS: jwksQuery.getJWKS() 
            }
            /* .. */
        });
    }
}
```

## Install via NPM
`npm install cognito-userpool-jwks-query`
