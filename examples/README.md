# Example Scripts

This directory contains example scripts demonstrating how to query and fetch logs from the Eye database.

## 📝 Available Examples

### 1. Node.js / JavaScript Example

**File**: `fetch-logs.js`

Fetches and filters logs using the GitHub API with Node.js (no external dependencies required).

**Usage**:
```bash
# Fetch all logs
node examples/fetch-logs.js

# Filter by type
node examples/fetch-logs.js --type error

# Filter by service
node examples/fetch-logs.js --service backend-api

# Filter by date
node examples/fetch-logs.js --since 2026-02-01

# Combine filters
node examples/fetch-logs.js --type audit --service authentication
```

**Requirements**: Node.js 12+

### 2. Python Example

**File**: `fetch-logs.py`

Fetches and filters logs using the GitHub API with Python (uses only standard library).

**Usage**:
```bash
# Fetch all logs
python examples/fetch-logs.py

# Filter by type
python examples/fetch-logs.py --type error

# Filter by service
python examples/fetch-logs.py --service backend-api

# Filter by date
python examples/fetch-logs.py --since 2026-02-01

# Combine filters
python examples/fetch-logs.py --type audit --service authentication
```

**Requirements**: Python 3.6+

## 🎯 What These Scripts Do

1. **Fetch log files**: Query GitHub API to get list of log files
2. **Download logs**: Fetch each log file's content
3. **Apply filters**: Filter logs by type, service, or date
4. **Display results**: Show formatted output with emojis
5. **Show statistics**: Display count by log type

## 🔧 Customization

You can modify these scripts to:

- Add more filter options (tags, metadata, etc.)
- Export to different formats (CSV, Excel, etc.)
- Send to logging services (Datadog, Splunk, etc.)
- Create alerts based on certain conditions
- Generate reports or dashboards

## 📚 Integration Examples

### Fetch from Shell Script

```bash
#!/bin/bash
# Fetch error logs and send notification
errors=$(node examples/fetch-logs.js --type error | grep "Results" | cut -d'(' -f2 | cut -d' ' -f1)

if [ "$errors" -gt 0 ]; then
  echo "Warning: $errors error logs found!"
  # Send notification, email, etc.
fi
```

### Fetch from Cron Job

```cron
# Check for new errors every hour
0 * * * * cd /path/to/eye && node examples/fetch-logs.js --type error --since $(date -d '1 hour ago' -I) | mail -s "Error Log Report" admin@example.com
```

### Fetch from Web Service

```javascript
// Express.js endpoint
app.get('/api/logs', async (req, res) => {
  const { fetchLogFiles, fetchLogContent } = require('./examples/fetch-logs');
  
  const files = await fetchLogFiles();
  const logs = await Promise.all(
    files.map(f => fetchLogContent(f.download_url))
  );
  
  res.json(logs);
});
```

### Fetch from Monitoring System

```python
# Prometheus exporter
from prometheus_client import Gauge
import time

error_count = Gauge('eye_error_logs', 'Number of error logs')

while True:
    # Fetch and count errors
    logs = fetch_logs(type='error')
    error_count.set(len(logs))
    time.sleep(300)  # Update every 5 minutes
```

## 🌐 Using GitHub API Directly

You can also query logs directly using the GitHub API without these scripts:

### REST API

```bash
# List all log files
curl https://api.github.com/repos/Bloxi-Dev/eye/contents/logs

# Get specific log
curl https://raw.githubusercontent.com/Bloxi-Dev/eye/main/logs/example-001.json
```

### GraphQL API

```graphql
query {
  repository(owner: "Bloxi-Dev", name: "eye") {
    object(expression: "main:logs/example-001.json") {
      ... on Blob {
        text
      }
    }
  }
}
```

## 🔐 Authentication

For higher rate limits, use a GitHub token:

**Node.js**:
```javascript
headers: {
  'Authorization': `token ${process.env.GITHUB_TOKEN}`,
  'User-Agent': 'Eye-Log-Fetcher'
}
```

**Python**:
```python
headers = {
    'Authorization': f'token {os.environ["GITHUB_TOKEN"]}',
    'User-Agent': 'Eye-Log-Fetcher'
}
```

**cURL**:
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/Bloxi-Dev/eye/contents/logs
```

## 📊 Rate Limits

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

For production use, always authenticate to avoid rate limits.

## 💡 Tips

1. **Cache results**: Store fetched logs locally to reduce API calls
2. **Use ETags**: Check if logs have changed before re-fetching
3. **Batch requests**: Fetch multiple logs in parallel
4. **Handle errors**: Add retry logic for network failures
5. **Respect rate limits**: Implement exponential backoff

## 🤝 Contributing

Have a useful example? Submit a PR with:
- Clear documentation
- Minimal dependencies
- Error handling
- Example usage

## 📄 License

These examples are provided as-is under the same license as the repository.
