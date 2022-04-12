import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const armory = new amplify.App(this, 'nft-armory', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'ilmoi',
        repository: 'nft-armory',
        oauthToken: SecretValue.secretsManager('ilmoi-github-token', { jsonField: 'token' }),
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
            files: -'**/*',
          },
        },
      }),
    });
  }
}
