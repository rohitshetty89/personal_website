import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface CertificateStackProps extends cdk.StackProps {
  /**
   * The domain name for the certificate (e.g., 'api.example.com')
   */
  domainName: string;
  /**
   * Additional domain names (SANs) for the certificate
   */
  subjectAlternativeNames?: string[];
}

/**
 * Certificate Stack - Creates ACM certificate for API Gateway custom domain
 *
 * After deployment:
 * 1. Check AWS Console → Certificate Manager for DNS validation CNAME records
 * 2. Add those CNAME records to your Cloudflare DNS (with proxy OFF / gray cloud)
 * 3. Wait for certificate validation
 */
export class CertificateStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const { domainName, subjectAlternativeNames } = props;

    // Create certificate with DNS validation
    this.certificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName: domainName,
      subjectAlternativeNames: subjectAlternativeNames,
      validation: acm.CertificateValidation.fromDns(),
      certificateName: `${domainName}-certificate`,
    });

    // Outputs
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: this.certificate.certificateArn,
      description: 'ACM Certificate ARN',
      exportName: 'ApiCertificateArn',
    });

    new cdk.CfnOutput(this, 'ValidationInstructions', {
      value: 'Check AWS Console → Certificate Manager for DNS validation CNAME. Add to Cloudflare with proxy OFF (gray cloud).',
      description: 'Next steps for certificate validation',
    });
  }
}
