/**
 * Configuration for your website deployment
 *
 * Update these values with your actual domain name before deploying.
 */
export const config = {
  /**
   * Your primary domain name (e.g., 'example.com')
   * Set to undefined if you don't have a custom domain yet
   */
  domainName: undefined as string | undefined,

  /**
   * Subdomain for the API (e.g., 'api' for api.example.com)
   * Only used if domainName is set
   */
  apiSubdomain: 'api',

  /**
   * AWS region for all stacks
   */
  region: 'us-east-1',
};

// Helper to get the full API domain name
export const getApiDomainName = (): string | undefined => {
  if (!config.domainName) return undefined;
  return `${config.apiSubdomain}.${config.domainName}`;
};

// Example configuration (uncomment and modify):
// export const config = {
//   domainName: 'example.com',
//   apiSubdomain: 'api',
//   region: 'us-east-1',
// };
// This would create: api.example.com for your API
