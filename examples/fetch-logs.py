#!/usr/bin/env python3
"""
Example script to fetch and query logs from the Eye database using Python

Usage:
    python examples/fetch-logs.py [--type TYPE] [--service SERVICE] [--since DATE]

Examples:
    python examples/fetch-logs.py
    python examples/fetch-logs.py --type error
    python examples/fetch-logs.py --service backend-api
    python examples/fetch-logs.py --type audit --since 2026-02-01
"""

import argparse
import json
import urllib.request
from datetime import datetime
from typing import List, Dict, Optional

REPO_OWNER = 'Bloxi-Dev'
REPO_NAME = 'eye'
LOGS_PATH = 'logs'


def fetch_log_files() -> List[Dict]:
    """Fetch list of log files from the repository"""
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{LOGS_PATH}'
    headers = {
        'User-Agent': 'Eye-Log-Fetcher-Python',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        files = json.loads(response.read())
    
    return [f for f in files if f['name'].endswith('.json')]


def fetch_log_content(download_url: str) -> Dict:
    """Fetch content of a single log file"""
    with urllib.request.urlopen(download_url) as response:
        return json.loads(response.read())


def matches_filters(log: Dict, filters: Dict) -> bool:
    """Check if log entry matches the provided filters"""
    if filters['type'] and log['type'] != filters['type']:
        return False
    
    if filters['service'] and log.get('service') != filters['service']:
        return False
    
    if filters['since']:
        log_date = datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00'))
        since_date = datetime.fromisoformat(filters['since'])
        if log_date < since_date:
            return False
    
    return True


def get_type_emoji(log_type: str) -> str:
    """Get emoji for log type"""
    emojis = {
        'info': 'ℹ️',
        'warning': '⚠️',
        'error': '❌',
        'debug': '🐛',
        'audit': '📋'
    }
    return emojis.get(log_type, '•')


def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description='Fetch and query logs from Eye database')
    parser.add_argument('--type', help='Filter by log type')
    parser.add_argument('--service', help='Filter by service name')
    parser.add_argument('--since', help='Filter by date (ISO 8601 format)')
    args = parser.parse_args()
    
    filters = {
        'type': args.type,
        'service': args.service,
        'since': args.since
    }
    
    try:
        print('🔍 Fetching logs from Eye database...\n')
        
        # Fetch log files
        files = fetch_log_files()
        print(f'Found {len(files)} log files\n')
        
        # Fetch all log contents
        logs = [fetch_log_content(f['download_url']) for f in files]
        
        # Apply filters
        filtered_logs = [log for log in logs if matches_filters(log, filters)]
        
        print(f'📊 Results ({len(filtered_logs)} matching entries):\n')
        print('─' * 80)
        
        # Display logs
        for log in filtered_logs:
            timestamp = datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00'))
            emoji = get_type_emoji(log['type'])
            
            print(f"{emoji}  {log['type'].upper():8} | {timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   ID: {log['id']}")
            print(f"   Message: {log['message']}")
            
            if 'service' in log:
                print(f"   Service: {log['service']}")
            
            if 'tags' in log and log['tags']:
                print(f"   Tags: {', '.join(log['tags'])}")
            
            print('─' * 80)
        
        # Summary statistics
        print('\n📈 Summary:')
        stats = {}
        for log in filtered_logs:
            log_type = log['type']
            stats[log_type] = stats.get(log_type, 0) + 1
        
        for log_type, count in stats.items():
            print(f'   {log_type}: {count}')
    
    except Exception as e:
        print(f'❌ Error: {e}')
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
