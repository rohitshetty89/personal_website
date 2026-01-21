import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export interface FrontendStackProps extends cdk.StackProps {
  /**
   * The primary domain name (e.g., 'example.com')
   * Used for documentation/output purposes only - DNS is managed in Cloudflare
   */
  domainName?: string;
}

/**
 * Frontend Stack - S3 Static Website Hosting with Cloudflare CDN
 *
 * This stack creates an S3 bucket configured for static website hosting.
 * Cloudflare handles CDN, SSL, and caching - no CloudFront needed.
 *
 * Architecture: User → Cloudflare (CDN/SSL) → S3 (static website)
 */
export class FrontendStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props?: FrontendStackProps) {
    super(scope, id, props);

    const { domainName } = props || {};

    // S3 bucket configured for static website hosting
    // Public access is required for S3 website endpoints
    this.bucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: `my-website-frontend-${this.account}-${this.region}`,
      // Allow public read access for static website hosting
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      publicReadAccess: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
      autoDeleteObjects: true, // Change to false for production
      // Enable static website hosting
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html', // SPA fallback - all routes serve index.html
    });

    this.websiteUrl = this.bucket.bucketWebsiteUrl;

    // Deploy frontend assets to S3
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend/build'))],
      destinationBucket: this.bucket,
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for frontend assets',
    });

    new cdk.CfnOutput(this, 'S3WebsiteUrl', {
      value: this.websiteUrl,
      description: 'S3 static website URL - use this for Cloudflare CNAME',
    });

    // Extract just the hostname for Cloudflare CNAME target
    const s3WebsiteHostname = cdk.Fn.select(2, cdk.Fn.split('/', this.websiteUrl));

    new cdk.CfnOutput(this, 'CloudflareCNAMETarget', {
      value: s3WebsiteHostname,
      description: 'Use this as the CNAME target in Cloudflare',
    });

    if (domainName) {
      new cdk.CfnOutput(this, 'WebsiteUrl', {
        value: `https://${domainName}`,
        description: 'Your website URL (after Cloudflare DNS setup)',
      });

      new cdk.CfnOutput(this, 'CloudflareSetup', {
        value: `Add CNAME: ${domainName} → ${s3WebsiteHostname}`,
        description: 'Cloudflare DNS configuration',
      });
    }
  }
}
