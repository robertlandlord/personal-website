# Personal website

This website uses [Zola](https://www.getzola.org/) to statically generate pages.

## Local Development

To start working locally, use:

```bash
zola serve
```

This will start a local development server at `http://127.0.0.1:1111`.

## Deployment to robertlandlord.com

Your site is configured with `base_url = "https://robertlandlord.com"` in `config.toml`. Here are several deployment options:

> **Note for AWS Route 53 users:** If your domain is registered with AWS Route 53, the deployment process is the same, but you'll configure DNS records in the Route 53 console instead of your domain registrar. Each option below includes Route 53-specific DNS configuration steps. To access Route 53: AWS Console → Route 53 → Hosted zones → Select your domain.

### Option 1: GitHub Pages (Recommended - Free & Easy)

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow file (`.github/workflows/deploy.yml`) is already set up

2. **Configure your domain:**
   - In your repository Settings → Pages, add `robertlandlord.com` as a custom domain
   - The `CNAME` file in the `static/` directory is already configured

3. **Configure DNS in Route 53:**
   - Go to AWS Console → Route 53 → Hosted zones
   - Select your `robertlandlord.com` hosted zone
   - Create DNS records (choose one method):
   
   **Method A - A Records (Recommended for apex domain):**
   - Create 4 A records:
     - Name: `@` (or leave blank for root domain)
     - Type: `A`
     - Value: `185.199.108.153`
     - TTL: `300` (or use default)
   - Repeat for: `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   
   **Method B - CNAME Record:**
   - Create 1 CNAME record:
     - Name: `@` (or leave blank for root domain)
     - Type: `CNAME`
     - Value: `yourusername.github.io` (replace with your GitHub username)
     - TTL: `300` (or use default)
   
   **For www subdomain (optional):**
   - Create a CNAME record:
     - Name: `www`
     - Type: `CNAME`
     - Value: `yourusername.github.io`
     - TTL: `300`

4. **Deploy:**
   - Push to the `main` branch and the GitHub Action will automatically build and deploy your site
   - DNS propagation may take a few minutes to a few hours

### Option 2: Netlify (Free & Easy)

1. **Connect your repository:**
   - Sign up/login at [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build settings:**
   - Build command: `zola build`
   - Publish directory: `public`
   - The `netlify.toml` file is already configured

3. **Configure your domain:**
   - In Netlify dashboard, go to Site settings → Domain management
   - Add your custom domain `robertlandlord.com`
   - Netlify will provide DNS records to add

4. **Configure DNS in Route 53:**
   - Go to AWS Console → Route 53 → Hosted zones
   - Select your `robertlandlord.com` hosted zone
   - Add the DNS records provided by Netlify (usually A or CNAME records)
   - Netlify will show you the exact values to use

### Option 3: Vercel (Free & Easy)

1. **Connect your repository:**
   - Sign up/login at [Vercel](https://vercel.com/)
   - Click "Add New Project" and import your GitHub repository

2. **Build settings:**
   - Framework Preset: Other
   - Build Command: `zola build`
   - Output Directory: `public`
   - Install Command: (leave empty, or install Zola if needed)

3. **Configure your domain:**
   - In project settings, go to Domains
   - Add `robertlandlord.com`
   - Vercel will provide DNS records to add

4. **Configure DNS in Route 53:**
   - Go to AWS Console → Route 53 → Hosted zones
   - Select your `robertlandlord.com` hosted zone
   - Add the DNS records provided by Vercel (usually A or CNAME records)
   - Vercel will show you the exact values to use

### Option 4: Cloudflare Pages (Free & Fast)

1. **Connect your repository:**
   - Sign up/login at [Cloudflare](https://pages.cloudflare.com/)
   - Click "Create a project" and connect your GitHub repository

2. **Build settings:**
   - Framework preset: None
   - Build command: `zola build`
   - Build output directory: `public`

3. **Configure your domain:**
   - In Pages settings, go to Custom domains
   - Add `robertlandlord.com`
   - **Note:** For Route 53, you'll need to manually configure DNS records in Route 53 (Cloudflare won't auto-configure since your domain is on Route 53, not Cloudflare DNS)
   - Cloudflare will provide the DNS records you need to add in Route 53

### Option 5: Manual Deployment (VPS/Server)

1. **Build the site:**
   ```bash
   zola build
   ```

2. **Upload the `public/` directory:**
   - Use `rsync`, `scp`, or FTP to upload the contents of `public/` to your web server
   - Ensure your web server is configured to serve files from the correct directory

3. **Configure your web server:**
   - Set up Nginx or Apache to serve the static files
   - Configure SSL with Let's Encrypt for HTTPS

## Building Locally

To build the site for production:

```bash
zola build
```

The output will be in the `public/` directory, which can be deployed to any static hosting service.