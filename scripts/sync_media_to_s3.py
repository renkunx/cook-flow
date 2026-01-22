#!/usr/bin/env python3
"""
Sync local mediafiles to S3 storage without requiring database connection.

Usage:
    python scripts/sync_media_to_s3.py --dry-run
    python scripts/sync_media_to_s3.py
"""

import os
import sys
import argparse
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv

# Load .env file from project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(project_root, '.env'))


def sync_to_s3(media_root, bucket_name, s3_prefix='', dry_run=False):
    """
    Sync local mediafiles to S3 using boto3
    """
    import boto3
    from boto3.s3.transfer import TransferConfig

    # Create S3 client
    s3_client = boto3.client('s3')

    # Create transfer config for multipart uploads
    transfer_config = TransferConfig(
        multipart_threshold=8 * 1024 * 1024,  # 8MB
        max_concurrency=10,
        multipart_chunksize=8 * 1024 * 1024,
    )

    media_path = Path(media_root)
    if not media_path.exists():
        print(f"Error: Media path does not exist: {media_root}")
        return

    # Find all files to upload
    files_to_upload = []
    total_size = 0

    print(f"Scanning {media_root}...")
    for file_path in media_path.rglob('*'):
        if file_path.is_file():
            relative_path = file_path.relative_to(media_path)
            s3_key = f"{s3_prefix}/{relative_path}".replace('//', '/').lstrip('/')
            file_size = file_path.stat().st_size
            files_to_upload.append((file_path, s3_key))
            total_size += file_size

    print(f"\nFound {len(files_to_upload)} files ({format_size(total_size)})")

    if dry_run:
        print("\n[DRY RUN] Files that would be uploaded:")
        for file_path, s3_key in files_to_upload[:10]:
            print(f"  {file_path} -> s3://{bucket_name}/{s3_key}")
        if len(files_to_upload) > 10:
            print(f"  ... and {len(files_to_upload) - 10} more files")
        return

    # Upload files
    print(f"\nUploading to s3://{bucket_name}/{s3_prefix}...")
    success_count = 0
    failed_files = []

    for file_path, s3_key in tqdm(files_to_upload, desc="Uploading"):
        try:
            s3_client.upload_file(
                str(file_path),
                bucket_name,
                s3_key,
                Config=transfer_config
            )
            success_count += 1
        except Exception as e:
            failed_files.append((file_path, s3_key, str(e)))

    print(f"\nUpload complete!")
    print(f"  Success: {success_count}/{len(files_to_upload)}")
    print(f"  Failed: {len(failed_files)}")

    if failed_files:
        print("\nFailed files:")
        for file_path, s3_key, error in failed_files:
            print(f"  {file_path}: {error}")


def format_size(size_bytes):
    """Format bytes to human readable size"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def main():
    parser = argparse.ArgumentParser(description='Sync mediafiles to S3')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be synced without actually doing it')
    parser.add_argument('--media-root', default='mediafiles', help='Path to mediafiles directory')
    parser.add_argument('--bucket', required=True, help='S3 bucket name')
    parser.add_argument('--prefix', default='recipes', help='S3 prefix (folder)')

    args = parser.parse_args()

    # Check environment variables
    access_key = os.getenv('S3_ACCESS_KEY') or os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('S3_SECRET_ACCESS_KEY') or os.getenv('AWS_SECRET_ACCESS_KEY')
    endpoint_url = os.getenv('S3_ENDPOINT_URL')

    if not access_key or not secret_key:
        print("Error: S3 credentials not found. Please set S3_ACCESS_KEY and S3_SECRET_ACCESS_KEY environment variables.")
        sys.exit(1)

    # Set boto3 credentials from environment
    if access_key:
        os.environ['AWS_ACCESS_KEY_ID'] = access_key
    if secret_key:
        os.environ['AWS_SECRET_ACCESS_KEY'] = secret_key
    if endpoint_url:
        os.environ['AWS_ENDPOINT_URL'] = endpoint_url

    sync_to_s3(
        media_root=args.media_root,
        bucket_name=args.bucket,
        s3_prefix=args.prefix,
        dry_run=args.dry_run
    )


if __name__ == '__main__':
    main()
