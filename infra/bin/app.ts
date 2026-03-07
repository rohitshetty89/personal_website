#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';
import { ApiStack } from '../lib/api-stack';
import { CertificateStack } from '../lib/certificate-stack';
import { config, getApiDomainName } from '../lib/config';

const app = new cdk.App();

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: config.region,
};

// Get the API domain name (e.g., api.example.com)
const apiDomainName = getApiDomainName();

// Certificate Stack for API Gateway custom domain (only if domain is configured)
let certificateStack: CertificateStack | undefined;
// if (apiDomainName) {
//   certificateStack = new CertificateStack(app, 'CertificateStack', {
//     env,
//     description: 'ACM Certificate for API Gateway custom domain',
//     domainName: apiDomainName,
//   });
// }

// Frontend Stack: S3 static website hosting (Cloudflare handles CDN/SSL)
new FrontendStack(app, 'FrontendStack', {
  env,
  description: 'Frontend infrastructure: S3 static website hosting with Cloudflare CDN',
  domainName: config.domainName,
});

// API Stack: API Gateway + Lambda
// const apiStack = new ApiStack(app, 'ApiStack', {
//   env,
//   description: 'API infrastructure: API Gateway and Lambda functions',
//   domainName: apiDomainName,
//   certificate: certificateStack?.certificate,
//   // Restrict CORS to your domain in production
//   allowedOrigins: config.domainName
//     ? [`https://${config.domainName}`, `https://www.${config.domainName}`]
//     : undefined,
// });

// Add dependency if certificate exists
// if (certificateStack) {
//   apiStack.addDependency(certificateStack);
// }

// Add tags to all resources
cdk.Tags.of(app).add('Project', 'MyWebsite');
cdk.Tags.of(app).add('ManagedBy', 'CDK');
