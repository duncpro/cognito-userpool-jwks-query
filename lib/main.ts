import * as cdk from '@aws-cdk/core';
import {Code, Function, Runtime} from '@aws-cdk/aws-lambda';
import {Provider} from '@aws-cdk/custom-resources';
import {CustomResource, Stack} from '@aws-cdk/core';

export interface CognitoUserPoolJWKSQueryProps {
  userPoolId: string
}

export class CognitoUserPoolJWKSQuery extends cdk.Construct {
  private customResource: CustomResource;

  constructor(scope: cdk.Construct, id: string, props: CognitoUserPoolJWKSQueryProps) {
    super(scope, id);

    const handler = new Function(this, 'CustomResourceHandler', {
      code: Code.fromAsset(`${__dirname}/handler`),
      handler: 'main.onCDKResourceEvent',
      runtime: Runtime.NODEJS_14_X,
    });

    const provider = new Provider(this, 'JWKSQueryProvider', {
      onEventHandler: handler
    });

    this.customResource = new CustomResource(this, 'JWKSQueryCustomResource', {
      serviceToken: provider.serviceToken,
      properties: {
        region: Stack.of(this).region,
        userPoolId: props.userPoolId
      }
    });
  }

  public getJWKS(): string {
    return this.customResource.getAttString('jwks');
  }
}
