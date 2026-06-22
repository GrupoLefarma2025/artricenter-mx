#!/usr/bin/env python3
"""
Deploy the dist/ folder to the configured FTP server.

Prerequisites:
  1. Copy .env.example to .env and fill in real credentials.
  2. Build the site: npm run build
  3. Run: python deploy_ftp.py
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


def upload_directory(ftp, local_dir, remote_dir):
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        remote_path = os.path.join(remote_dir, rel_path).replace(os.sep, "/")
        if remote_path != "/" and remote_path.endswith("/"):
            remote_path = remote_path[:-1]

        for d in dirs:
            remote_subdir = os.path.join(remote_path, d).replace(os.sep, "/")
            try:
                ftp.mkd(remote_subdir)
                print(f"Created directory: {remote_subdir}")
            except Exception as e:
                if "550" in str(e) or "File exists" in str(e):
                    pass
                else:
                    print(f"Warning creating dir {remote_subdir}: {e}")

        for f in files:
            local_file = os.path.join(root, f)
            remote_file = os.path.join(remote_path, f).replace(os.sep, "/")
            with open(local_file, "rb") as file:
                ftp.storbinary(f"STOR {remote_file}", file)
            print(f"Uploaded: {remote_file}")


def main():
    load_env()

    ftp_host = get_env_var("FTP_HOST")
    ftp_port = int(get_env_var("FTP_PORT", "21"))
    ftp_user = get_env_var("FTP_USER")
    ftp_pass = get_env_var("FTP_PASS")
    remote_dir = get_env_var("FTP_REMOTE_DIR", "/")
    local_dir = get_env_var("LOCAL_DIST_DIR", "./dist")

    try:
        ftp = FTP()
        ftp.connect(ftp_host, ftp_port, timeout=60)
        ftp.login(ftp_user, ftp_pass)
        ftp.cwd(remote_dir)
        print(f"Connected to {ftp_host}, uploading {local_dir} to {remote_dir}")
        upload_directory(ftp, local_dir, remote_dir)
        ftp.quit()
        print("Upload complete!")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
