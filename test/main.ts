import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {Construct, Stack, CfnOutput} from '@aws-cdk/core';
import {UserPool} from '@aws-cdk/aws-cognito'
import {CognitoUserPoolJWKSQuery} from '../lib/main';

class TestStack extends Stack {
    constructor(scope: Construct) {
        super(scope, 'TestStack');

        const userPool = new UserPool(this, 'TestUserPool');

        const testQuery = new CognitoUserPoolJWKSQuery(this, 'UserPoolJWKSQuery', {
            userPoolId: userPool.userPoolId
        });

        new CfnOutput(this, 'UserPoolJWKS', {
            value: testQuery.getJWKS()
        });
    }
}

const app = new cdk.App();
new TestStack(app);
