# Contributing to Eye

Thank you for your interest in contributing to Eye! This document provides guidelines for contributing to the log database.

## 🔐 Access Levels

### Public (Everyone)
- ✅ View all logs
- ✅ Clone the repository
- ✅ Query logs via API
- ✅ Report issues
- ✅ Suggest improvements

### Admins & Maintainers Only
- ✅ Add new log entries
- ✅ Modify existing logs
- ✅ Delete logs
- ✅ Update schema
- ✅ Approve pull requests

## 📝 Adding a New Log Entry

### Prerequisites

You must be listed in the CODEOWNERS file to add logs. If you believe you should have access, please contact the repository owner.

### Steps

1. **Fork or Branch**
   ```bash
   git clone https://github.com/Bloxi-Dev/eye.git
   cd eye
   git checkout -b add-log-entry
   ```

2. **Create Your Log Entry**
   
   Create a new JSON file in the `/logs` directory:
   ```bash
   nano logs/my-log-id.json
   ```
   
   Use this template:
   ```json
   {
     "id": "my-log-id",
     "timestamp": "2026-02-01T10:30:00.000Z",
     "type": "info",
     "message": "Description of what happened",
     "service": "my-service",
     "metadata": {
       "user": "username",
       "action": "action-performed",
       "key": "value"
     },
     "tags": ["tag1", "tag2"]
   }
   ```

3. **Important Rules**
   
   - ✅ Filename must match the `id` field (e.g., `my-log-id.json` has `"id": "my-log-id"`)
   - ✅ Use unique IDs (check existing logs to avoid duplicates)
   - ✅ Use ISO 8601 timestamp format
   - ✅ Type must be one of: `info`, `warning`, `error`, `debug`, `audit`
   - ✅ All required fields must be present: `id`, `timestamp`, `type`, `message`

4. **Validate Locally (Optional but Recommended)**
   
   Install dependencies:
   ```bash
   npm install -g ajv-cli ajv-formats
   ```
   
   Validate your log:
   ```bash
   ajv validate -s schema/log-entry.json -d logs/my-log-id.json --spec=draft7
   ```

5. **Commit and Push**
   ```bash
   git add logs/my-log-id.json
   git commit -m "Add log entry: my-log-id"
   git push origin add-log-entry
   ```

6. **Create Pull Request**
   
   - Go to GitHub and create a pull request
   - Provide a clear description of the log entry
   - Wait for automated validation to pass
   - Request review from a CODEOWNER
   - Wait for approval and merge

## 🔄 Modifying Existing Logs

While technically possible, modifying existing logs is generally discouraged as it defeats the purpose of an audit trail. Instead:

- **Prefer adding a new log entry** that references or corrects the previous one
- Only modify if absolutely necessary (e.g., removing sensitive data, fixing critical errors)
- Document the reason for modification in the PR description

## 🗑️ Deleting Logs

Deleting logs should be rare and only done for valid reasons:

- Sensitive data accidentally committed
- Duplicate entries
- Spam or invalid data

To delete:
1. Create a branch
2. Remove the log file
3. Create a PR with justification
4. Get CODEOWNER approval

## 🛠️ Modifying the Schema

Changes to the schema file require careful consideration:

1. **Ensure backward compatibility** when possible
2. **Update documentation** to reflect schema changes
3. **Test with existing logs** to ensure they still validate
4. **Get consensus** from other maintainers before merging

## ✅ Validation Checks

All pull requests automatically run the following validations:

1. **JSON Schema Validation**: All logs must match the schema
2. **Unique ID Check**: No duplicate IDs allowed
3. **Filename Match**: Filename must match the log's `id` field
4. **Valid JSON**: All files must be valid JSON

Pull requests will fail if any validation check fails.

## 🐛 Reporting Issues

Found a problem? Please open an issue with:

- Clear description of the problem
- Steps to reproduce (if applicable)
- Expected vs actual behavior
- Relevant log entries or examples

## 💡 Suggesting Improvements

We welcome suggestions for:

- New log types or fields
- Better organization or indexing
- Improved documentation
- Additional validation rules
- Integration tools or scripts

Open an issue with the label `enhancement` to suggest improvements.

## 📋 Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Keep logs factual and appropriate
- Don't commit sensitive data (passwords, tokens, PII)
- Follow the established patterns and conventions

## 🤝 Getting Help

Need help? You can:

- Check the [README.md](README.md) for documentation
- Look at [example logs](logs/example-001.json)
- Review the [schema definition](schema/log-entry.json)
- Open an issue for questions

## 📞 Contact

For access requests or other inquiries, contact the repository maintainers listed in CODEOWNERS.

---

Thank you for contributing to Eye! Your logs help build a better service.