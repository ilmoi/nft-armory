import { SecretValue, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AnyPrincipal, Effect } from 'aws-cdk-lib/aws-iam';

//todo unfortunately this approach doesn't work
// - amplify doesn't support VPC placing - https://stackoverflow.com/questions/71849212/aws-how-to-restrict-access-to-api-gateway-from-amplify-app
// - w/o VPC placing I can't restrict traffic to a private API endpoint
// - there's a bigger question: surely the FE on Amplify is running on user's machine - how can it even be inside a VPC w/o some intermediate server?
// - the other alternative is using EB + DC with 2 containers: FE & BE, exposing only FE to internet
// - is that even sufficient for security? Eg for GL I also used OAuth to secure the BE API

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // --------------------------------------- backend

    const fn = new lambda.Function(this, 'gengo-auth', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/auth')),
    });

    // const apiResourcePolicy = new iam.PolicyDocument({
    //   statements: [
    //     new iam.PolicyStatement({
    //       effect: Effect.DENY,
    //       principals: [new AnyPrincipal()],
    //       actions: ['execute-api:Invoke'],
    //       resources: ['execute-api:/*/*/*'],
    //     }),
    //     new iam.PolicyStatement({
    //       effect: Effect.ALLOW,
    //       principals: [new AnyPrincipal()],
    //       actions: ['execute-api:Invoke'],
    //       resources: ['execute-api:/*/*/*'],
    //       conditions: {
    //         NotIpAddress: {
    //           'aws:SourceIp': whitelistedIps,
    //         },
    //       },
    //     }),
    //   ],
    // });

    const api = new apigateway.LambdaRestApi(this, 'gengo-api', {
      handler: fn,
      // policy: apiResourcePolicy,
    });

    const url = new CfnOutput(this, `api-url`, {
      exportName: `api-url`,
      value: `https://${api.restApiId}.execute-api.${this.region}.amazonaws.com/prod/`,
    });

    // --------------------------------------- frontend

    const app = new amplify.App(this, 'nft-armory-app-2', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'ilmoi',
        repository: 'nft-armory',
        oauthToken: SecretValue.secretsManager('aws-amplify-github', { jsonField: 'token' }),
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: ['yarn'],
            },
            build: {
              commands: ['yarn build'],
            },
          },
          artifacts: {
            baseDirectory: 'dist',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*'],
          },
        },
      }),
    });

    app.addBranch('main');
    app.addEnvironment('VUE_APP_MAINNET_URL', 'https://test-auth.genesysgo.net/');
    app.addEnvironment('VUE_APP_GENGO_AUTH', url.value);
  }
}
