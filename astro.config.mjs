import { defineConfig } from 'astro/config';

// Integrations
import svelte from '@astrojs/svelte';
import react from "@astrojs/react";
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// Adapters
import vercelAdapter from '@astrojs/vercel/serverless';
import netlifyAdapter from '@astrojs/netlify';
import nodeAdapter from '@astrojs/node';
import cloudflareAdapter from '@astrojs/cloudflare';

// Helper function to unwrap both Vite and Node environment variables
const unwrapEnvVar = (varName, fallbackValue) => {
  const classicEnvVar = process?.env && process.env[varName];
  const viteEnvVar = import.meta.env[varName];
  return classicEnvVar || viteEnvVar || fallbackValue;
}

// Determine the deploy target (vercel, netlify, cloudflare, node)
const deployTarget = unwrapEnvVar('PLATFORM', 'node').toLowerCase();

// Determine the output mode (server, hybrid or static)
const output = unwrapEnvVar('OUTPUT', 'hybrid');

// The FQDN of where the site is hosted (used for sitemaps & canonical URLs)
const site = unwrapEnvVar('SITE_URL', 'https://codingplus.org/');

// The base URL of the site (if serving from a subdirectory)
const base = unwrapEnvVar('BASE_URL', '/');

// Should run the app in boss-mode (requires extra configuration)
const isBossServer = unwrapEnvVar('BOSS_SERVER', false);

// Initialize Astro integrations
const integrations = [svelte(), react(), partytown(), sitemap()];

// Set the appropriate adapter, based on the deploy target
function getAdapter(target) {
  switch(target) {
    case 'vercel':
      return vercelAdapter();
    case 'netlify':
      return netlifyAdapter();
    case 'cloudflare':
      return cloudflareAdapter();
    case 'node':
      return nodeAdapter({ mode: 'middleware' });
    default:
      throw new Error(`Unsupported deploy target: ${target}`);
  }
}
const adapter = getAdapter(deployTarget);

const redirects = {
  '/about': '/check/about',
};

// Skip the marketing homepage for self-hosted users
if (!isBossServer && isBossServer !== true) {
  redirects['/'] = '/check';
}

// Export Astro configuration
export default defineConfig({ output, base, integrations, site, adapter, redirects });

