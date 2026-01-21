# My Website

React frontend + Kotlin backend deployed on AWS using CDK, with Cloudflare as the CDN.

## Architecture

```
User → Cloudflare (CDN/SSL) → S3 (static website)      [HTTPS → HTTP]
     → Cloudflare (proxy)   → API Gateway → Lambda     [HTTPS → HTTPS]
```

**Why this architecture?**
- Cloudflare provides free CDN, SSL, and DDoS protection
- No CloudFront = lower AWS costs
- API Gateway custom domain for stable, clean API URLs
- End-to-end HTTPS for API calls

## Project Structure

```
my_website/
├── frontend/           # React TypeScript app
│   ├── src/
│   └── package.json
├── backend/            # Kotlin Lambda function
│   ├── src/main/kotlin/
│   └── build.gradle.kts
├── infra/              # AWS CDK infrastructure
│   ├── lib/
│   │   ├── frontend-stack.ts     # S3 static website
│   │   ├── api-stack.ts          # API Gateway + Lambda + custom domain
│   │   ├── certificate-stack.ts  # ACM certificate for API
│   │   └── config.ts             # Domain configuration
│   └── bin/app.ts
└── package.json        # Root monorepo config
```

## Prerequisites

- Node.js 18+
- npm 9+
- Java 21 (for Kotlin backend)
- AWS CLI configured with credentials
- AWS CDK CLI (`npm install -g aws-cdk`)
- Domain registered in Cloudflare

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Domain

Edit `infra/lib/config.ts` with your domain:

```typescript
export const config = {
  domainName: 'yourdomain.com',
  apiSubdomain: 'api',  // Creates api.yourdomain.com
  region: 'us-east-1',
};
```

### 3. Build the Frontend

```bash
npm run build:frontend
```

### 4. Build the Backend

```bash
cd backend
./gradlew shadowJar
cd ..
```

### 5. Deploy to AWS

```bash
# Bootstrap CDK (first time only)
cd infra
npx cdk bootstrap

# Deploy all stacks
npm run deploy
```

## Cloudflare Setup

### Part A: API Certificate Validation (Do First)

After deploying `CertificateStack`, you must validate the SSL certificate:

1. Go to **AWS Console → Certificate Manager** (in your configured region)
2. Find the certificate for `api.yourdomain.com` (status: "Pending validation")
3. Copy the **CNAME name** and **CNAME value**
4. In **Cloudflare Dashboard → DNS**, add a CNAME record:
   - **Name**: The CNAME name from ACM (e.g., `_abc123.api`)
   - **Target**: The CNAME value from ACM
   - **Proxy status**: DNS only (gray cloud) ⚠️ Important!
5. Wait for validation (usually a few minutes)

### Part B: Frontend DNS (S3)

Add CNAME records for your frontend:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` | `<S3-website-hostname>` | Proxied (orange) |
| CNAME | `www` | `<S3-website-hostname>` | Proxied (orange) |

Use the `CloudflareCNAMETarget` value from the CDK output.

### Part C: API DNS

Add a CNAME record for your API:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `api` | `<API-Gateway-domain>` | Proxied (orange) |

Use the `CustomDomainTarget` value from the CDK output (looks like `d-xxxxxx.execute-api.us-east-1.amazonaws.com`).

### Part D: Configure SSL/TLS

In Cloudflare Dashboard → SSL/TLS:

| Setting | Value | Reason |
|---------|-------|--------|
| Encryption mode | **Flexible** | S3 website endpoints are HTTP-only |

> **Note**: API Gateway uses HTTPS natively, so API calls are fully encrypted even with Flexible mode. Only the S3 frontend has an unencrypted last hop.

### Part E: Additional Settings (Optional)

Free features you can enable:
- **Always Use HTTPS**: Redirect HTTP to HTTPS
- **Auto Minify**: JS, CSS, HTML
- **Brotli compression**: Smaller file sizes

## Stacks

| Stack | Resources |
|-------|-----------|
| `CertificateStack` | ACM certificate for API custom domain |
| `FrontendStack` | S3 bucket with static website hosting |
| `ApiStack` | API Gateway + Lambda + custom domain |

## URLs After Setup

| Service | URL |
|---------|-----|
| Frontend | `https://yourdomain.com` |
| API | `https://api.yourdomain.com` |

## Development

### Frontend Development

```bash
cd frontend
npm start
```

Update `frontend/.env.local` with your API URL:
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### Backend Development

```bash
cd backend
./gradlew test
./gradlew shadowJar
```

### Infrastructure

```bash
cd infra
npm run synth     # Generate CloudFormation templates
npm run diff      # Preview changes
npm run deploy    # Deploy to AWS
npm run destroy   # Tear down all resources
```

## Deployment Without Custom Domain

You can deploy without a custom domain initially:

1. Leave `domainName` as `undefined` in `config.ts`
2. Deploy normally
3. Access:
   - Frontend via S3 website URL (HTTP only)
   - API via default API Gateway URL (`https://xxx.execute-api.region.amazonaws.com/prod`)

## Useful Commands

```bash
# CDK
cdk synth          # Emit synthesized CloudFormation template
cdk diff           # Compare deployed stack with current state
cdk deploy         # Deploy stack to AWS
cdk destroy        # Destroy stack

# Gradle
./gradlew test           # Run tests
./gradlew shadowJar      # Build fat JAR
./gradlew clean build    # Clean and build
```

## Troubleshooting

### Certificate stuck in "Pending validation"
- Ensure the CNAME record is added correctly in Cloudflare
- **Proxy must be OFF** (gray cloud) for validation records
- Wait a few minutes for DNS propagation

### API returns CORS errors
- Check that `allowedOrigins` in `app.ts` includes your domain
- Verify the frontend is making requests to the correct API URL

### Site shows "Access Denied" or 403 error
- Ensure S3 bucket has public read access enabled
- Check that `index.html` exists in the bucket

### SSL errors in browser
- Verify Cloudflare SSL mode is set to **Flexible**
- Ensure HTTPS is enabled in Cloudflare

### Cloudflare shows "Error 521" (Web server is down)
- S3 website URL might be incorrect
- Check that the S3 bucket has website hosting enabled

### Changes not appearing after deploy
- Cloudflare may be caching old content
- Purge cache: Cloudflare Dashboard → Caching → Purge Everything

## Cost Comparison

| Component | With CloudFront | With Cloudflare |
|-----------|----------------|-----------------|
| CDN | ~$0.085/GB | Free |
| SSL Certificate | Free (ACM) | Free (Cloudflare) + Free (ACM for API) |
| DDoS Protection | Basic | Free |
| S3 Storage | ~$0.023/GB | ~$0.023/GB |
| S3 Requests | ~$0.0004/1K | ~$0.0004/1K |
| API Gateway | ~$3.50/million requests | ~$3.50/million requests |

Using Cloudflare eliminates CloudFront data transfer costs entirely.
# personal_website
