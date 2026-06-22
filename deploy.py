#!/usr/bin/env python3
"""
Deploy the dist/ folder to the configured FTP server.

Prerequisites:
  1. Copy .env.example to .env and fill in real credentials.
  2. Build the site: npm run build
  3. Run: python deploy.py
"""
from ftplib import FTP
import os
import sys
from pathlib import Path


def load_env():
    """Load environment variables from .env file if present."""
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                os.environ.setdefault(key, value)


def get_env_var(name, default=None):
    value = os.environ.get(name, default)
    if value is None:
        print(f"Error: Environment variable {name} is not set.", file=sys.stderr)
        print("Copy .env.example to .env and fill in the credentials.", file=sys.stderr)
        sys.exit(1)
    return value


def upload_file(ftp, local_path, remote_path):
    """Upload a single file to FTP server."""
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)
    print(f"✓ Uploaded: {remote_path}")


def upload_directory(ftp, local_dir, remote_dir):
    """Recursively upload directory to FTP server."""
    for root, dirs, files in os.walk(local_dir):
        relative_path = os.path.relpath(root, local_dir)
        if relative_path == ".":
            remote_path = remote_dir
        else:
            remote_path = f"{remote_dir}{relative_path}/"

        try:
            ftp.mkd(remote_path)
        except Exception:
            pass  # Directory might already exist

        for file in files:
            local_file = os.path.join(root, file)
            remote_file = f"{remote_path}{file}"
            upload_file(ftp, local_file, remote_file)


def main():
    load_env()

    ftp_host = get_env_var("FTP_HOST")
    ftp_user = get_env_var("FTP_USER")
    ftp_pass = get_env_var("FTP_PASS")
    ftp_dir = get_env_var("FTP_REMOTE_DIR", "/")
    local_dist = get_env_var("LOCAL_DIST_DIR", "dist")

    print(f"Connecting to {ftp_host}...")
    ftp = FTP(ftp_host)
    ftp.login(ftp_user, ftp_pass)
    ftp.set_pasv(True)

    print(f"Connected. Current directory: {ftp.pwd()}")
    ftp.cwd(ftp_dir)
    print(f"Changed to: {ftp.pwd()}")

    print(f"\nUploading {local_dist}/ to {ftp_dir}...")
    upload_directory(ftp, local_dist, "")

    print("\n✓ Upload complete!")
    ftp.quit()


if __name__ == "__main__":
    main()
