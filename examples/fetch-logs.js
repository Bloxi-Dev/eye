#!/usr/bin/env node

/**
 * Example script to fetch and query logs from the Eye database
 * 
 * Usage:
 *   node examples/fetch-logs.js [--type TYPE] [--service SERVICE] [--since DATE]
 * 
 * Examples:
 *   node examples/fetch-logs.js
 *   node examples/fetch-logs.js --type error
 *   node examples/fetch-logs.js --service backend-api
 *   node examples/fetch-logs.js --type audit --since 2026-02-01
 */

const https = require('https');

const REPO_OWNER = 'Bloxi-Dev';
const REPO_NAME = 'eye';
const LOGS_PATH = 'logs';

// Parse command line arguments
const args = process.argv.slice(2);
const filters = {
  type: null,
  service: null,
  since: null
};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  if (filters.hasOwnProperty(key)) {
    filters[key] = value;
  }
}

/**
 * Fetch all log files from the repository
 */
async function fetchLogFiles() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${LOGS_PATH}`,
      headers: {
        'User-Agent': 'Eye-Log-Fetcher',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const files = JSON.parse(data);
          const jsonFiles = files.filter(f => f.name.endsWith('.json'));
          resolve(jsonFiles);
        } else {
          reject(new Error(`Failed to fetch files: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch content of a single log file
 */
async function fetchLogContent(downloadUrl) {
  return new Promise((resolve, reject) => {
    https.get(downloadUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to fetch log: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Apply filters to log entry
 */
function matchesFilters(log, filters) {
  if (filters.type && log.type !== filters.type) {
    return false;
  }

  if (filters.service && log.service !== filters.service) {
    return false;
  }

  if (filters.since) {
    const logDate = new Date(log.timestamp);
    const sinceDate = new Date(filters.since);
    if (logDate < sinceDate) {
      return false;
    }
  }

  return true;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Fetching logs from Eye database...\n');

    // Fetch list of log files
    const files = await fetchLogFiles();
    console.log(`Found ${files.length} log files\n`);

    // Fetch all log contents
    const logs = await Promise.all(
      files.map(f => fetchLogContent(f.download_url))
    );

    // Apply filters
    const filteredLogs = logs.filter(log => matchesFilters(log, filters));

    console.log(`📊 Results (${filteredLogs.length} matching entries):\n`);
    console.log('─'.repeat(80));

    // Display logs
    filteredLogs.forEach(log => {
      const timestamp = new Date(log.timestamp).toLocaleString();
      const typeEmoji = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        debug: '🐛',
        audit: '📋'
      }[log.type] || '•';

      console.log(`${typeEmoji}  ${log.type.toUpperCase().padEnd(8)} | ${timestamp}`);
      console.log(`   ID: ${log.id}`);
      console.log(`   Message: ${log.message}`);
      if (log.service) {
        console.log(`   Service: ${log.service}`);
      }
      if (log.tags && log.tags.length > 0) {
        console.log(`   Tags: ${log.tags.join(', ')}`);
      }
      console.log('─'.repeat(80));
    });

    // Summary statistics
    console.log('\n📈 Summary:');
    const stats = filteredLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(stats).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { fetchLogFiles, fetchLogContent, matchesFilters };
