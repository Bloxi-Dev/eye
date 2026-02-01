# 👁️ Eye - The All-Seeing Log Database

[![Validate Log Entries](https://github.com/Bloxi-Dev/eye/actions/workflows/validate-logs.yml/badge.svg)](https://github.com/Bloxi-Dev/eye/actions/workflows/validate-logs.yml)

A public database store on GitHub for logging and tracking service events. The repository serves as a centralized, version-controlled, and publicly viewable log database, with write access restricted to administrators and maintainers.

## 📋 Overview

**Eye** is a GitHub-based log storage system that provides:

- **Public Read Access**: Anyone can view and query logs
- **Restricted Write Access**: Only admins and maintainers can add or remove logs
- **Version Control**: Full Git history of all log changes
- **Schema Validation**: Automated validation of log entries
- **API Access**: Query logs via GitHub API

## 🗂️ Repository Structure

```
eye/
├── logs/              # Log entry storage (JSON files)
│   ├── README.md      # Documentation for logs directory
│   └── *.json         # Individual log entries
├── schema/            # JSON Schema definitions
│   └── log-entry.json # Schema for log entries
├── .github/
│   └── workflows/     # GitHub Actions for validation
└── CODEOWNERS         # Access control configuration
```

## 📖 Usage

### Viewing Logs

Logs are publicly accessible and can be viewed in several ways:

1. **Browse on GitHub**: Navigate to the `/logs` directory
2. **Clone the repository**: 
   ```bash
   git clone https://github.com/Bloxi-Dev/eye.git
   ```
3. **GitHub API**: Query logs programmatically
   ```bash
   curl https://api.github.com/repos/Bloxi-Dev/eye/contents/logs
   ```

### Adding Logs (Admins/Maintainers Only)

Only repository administrators and maintainers listed in the CODEOWNERS file can add or modify logs:

1. Fork the repository or create a new branch
2. Add a new JSON file to the `/logs` directory following the schema
3. Create a pull request
4. Wait for automated validation to pass
5. Get approval from a CODEOWNER
6. Merge the pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

## 📝 Log Entry Schema

Each log entry must be a valid JSON file following this structure:

```json
{
  "id": "unique-log-id",
  "timestamp": "2026-02-01T08:54:22.369Z",
  "type": "info",
  "message": "Log message here",
  "service": "service-name",
  "metadata": {
    "user": "username",
    "action": "action-performed"
  },
  "tags": ["tag1", "tag2"]
}
```

**Required Fields:**
- `id`: Unique identifier (must match filename)
- `timestamp`: ISO 8601 format
- `type`: One of: `info`, `warning`, `error`, `debug`, `audit`
- `message`: Log message content

**Optional Fields:**
- `service`: Service or component name
- `metadata`: Additional key-value data
- `tags`: Array of tags for categorization

Full schema: [schema/log-entry.json](schema/log-entry.json)

## 🔒 Access Control

This repository uses several mechanisms to enforce access control:

1. **CODEOWNERS**: Requires approval from designated maintainers for changes to `/logs` and `/schema`
2. **Branch Protection**: (Configure on GitHub) Requires pull request reviews before merging
3. **Automated Validation**: GitHub Actions validate all log entries against the schema

## 🤖 Automated Validation

Every pull request that modifies logs is automatically validated for:

- ✅ JSON schema compliance
- ✅ Unique log IDs (no duplicates)
- ✅ Filename matches log ID
- ✅ Valid timestamp format
- ✅ Required fields present

## 🛠️ Integration

### REST API Example

Query logs using the GitHub REST API:

```javascript
// Fetch all logs
fetch('https://api.github.com/repos/Bloxi-Dev/eye/contents/logs')
  .then(response => response.json())
  .then(files => {
    // Filter for JSON files
    const logFiles = files.filter(f => f.name.endsWith('.json'));
    // Fetch each log entry
    return Promise.all(
      logFiles.map(f => 
        fetch(f.download_url).then(r => r.json())
      )
    );
  })
  .then(logs => console.log(logs));
```

### GraphQL API Example

```graphql
query {
  repository(owner: "Bloxi-Dev", name: "eye") {
    object(expression: "main:logs") {
      ... on Tree {
        entries {
          name
          object {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
}
```

## 📚 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this repository.

## 📄 License

This project is licensed under the terms specified in [LICENSE](LICENSE).

## 🔗 Links

- [Issues](https://github.com/Bloxi-Dev/eye/issues)
- [Pull Requests](https://github.com/Bloxi-Dev/eye/pulls)
- [Actions](https://github.com/Bloxi-Dev/eye/actions)
