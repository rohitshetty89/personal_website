import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ApiStackProps extends cdk.StackProps {
  /**
   * Custom domain name for the API (e.g., 'api.example.com')
   */
  domainName?: string;
  /**
   * ACM certificate for the custom domain
   */
  certificate?: acm.ICertificate;
  /**
   * Allowed origins for CORS (defaults to all origins if not specified)
   */
  allowedOrigins?: string[];
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly helloFunction: lambda.Function;
  public readonly customDomain?: apigateway.DomainName;

  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    const { domainName, certificate, allowedOrigins } = props || {};

    // Lambda function for Kotlin backend
    // Uses Java runtime since Kotlin compiles to JVM bytecode
    this.helloFunction = new lambda.Function(this, 'KotlinHandler', {
      functionName: 'my-website-api-handler',
      runtime: lambda.Runtime.JAVA_21,
      handler: 'com.mywebsite.Handler::handleRequest',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/build/libs'), {
        // Exclude source files, only include the fat JAR
        exclude: ['*-sources.jar', '*-javadoc.jar'],
      }),
      memorySize: 512, // Kotlin/JVM benefits from more memory
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64, // Cost effective, good performance
      environment: {
        JAVA_TOOL_OPTIONS: '-XX:+TieredCompilation -XX:TieredStopAtLevel=1', // Faster cold starts
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      tracing: lambda.Tracing.ACTIVE, // Enable X-Ray tracing
    });

    // Determine CORS origins
    const corsOrigins = allowedOrigins || apigateway.Cors.ALL_ORIGINS;

    // API Gateway REST API
    this.api = new apigateway.RestApi(this, 'MyWebsiteApi', {
      restApiName: 'My Website API',
      description: 'API Gateway for My Website backend',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 1000,
        throttlingBurstLimit: 500,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: corsOrigins,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'Authorization',
          'X-Amz-Date',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
      },
    });

    // Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(this.helloFunction, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    // API Routes
    // GET /hello - example endpoint
    const helloResource = this.api.root.addResource('hello');
    helloResource.addMethod('GET', lambdaIntegration);

    // POST /hello - example endpoint
    helloResource.addMethod('POST', lambdaIntegration);

    // Add more routes as needed:
    // const usersResource = this.api.root.addResource('users');
    // usersResource.addMethod('GET', lambdaIntegration);
    // usersResource.addMethod('POST', lambdaIntegration);
    // const userByIdResource = usersResource.addResource('{id}');
    // userByIdResource.addMethod('GET', lambdaIntegration);

    // Custom domain configuration
    if (domainName && certificate) {
      this.customDomain = new apigateway.DomainName(this, 'ApiDomainName', {
        domainName: domainName,
        certificate: certificate,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
      });

      // Map the custom domain to the API
      new apigateway.BasePathMapping(this, 'ApiBasePathMapping', {
        domainName: this.customDomain,
        restApi: this.api,
        // basePath: 'v1', // Uncomment to add a base path like api.example.com/v1
      });

      // Outputs for custom domain
      new cdk.CfnOutput(this, 'CustomDomainName', {
        value: domainName,
        description: 'API custom domain name',
      });

      new cdk.CfnOutput(this, 'CustomDomainTarget', {
        value: this.customDomain.domainNameAliasDomainName,
        description: 'Target for Cloudflare CNAME record',
      });

      new cdk.CfnOutput(this, 'CloudflareSetup', {
        value: `Add CNAME: ${domainName} → ${this.customDomain.domainNameAliasDomainName}`,
        description: 'Cloudflare DNS configuration for API',
      });

      new cdk.CfnOutput(this, 'ApiCustomUrl', {
        value: `https://${domainName}`,
        description: 'API URL with custom domain',
      });
    }

    // Standard outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway default URL',
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: this.api.restApiId,
      description: 'API Gateway ID',
    });
  }
}
