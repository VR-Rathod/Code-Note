---
seoTitle: Automation Complete Guide – Shell, Python, CI/CD, RPA & Workflow Automation
description: "Comprehensive automation reference covering shell scripting, Python automation, task scheduling, CI/CD pipelines, RPA, web scraping, GUI automation, file/system automation, API automation, test automation, and workflow orchestration. Beginner to advanced."
keywords: "automation, shell scripting, Python automation, task scheduler, RPA, GitHub Actions, Ansible, Terraform, CI/CD automation, web scraping, GUI automation, workflow orchestration, cron jobs, Selenium, PyAutoGUI, Celery, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Automation – Complete Engineering Guide
enableToc: true
---

> [!info] About This Page
> Automation is the practice of making computers do repetitive work so humans don't have to.
> It spans everything from a 5-line [[Shell Script]] to a full [[DevOps]] CI/CD pipeline to an enterprise RPA workflow.
> Every hour you invest in automating a task pays back every time that task runs.

- # History & Why Automation Matters
  collapsed:: true
	- ## How Automation Evolved
		- Automation in computing started with **batch processing** in the 1950s — instead of a human feeding punch cards one by one, a stack of jobs ran overnight unattended. The computer worked while the humans slept.
		- **Shell scripts** in Unix (1970s) were the first practical automation for system administrators — stringing commands together into repeatable procedures. The same philosophy is alive in Bash today.
		- The **1990s web explosion** created demand for automated testing (Selenium was born in 2004), automated deployment, and automated data collection (web scraping).
		- **CI/CD** (2000s–2010s) automated the most expensive manual process in software: getting code from a developer's laptop to production. See [[DevOps]] for the full story.
		- Today, **AI-assisted automation** (GitHub Copilot, LLM agents, code generation) is automating the automation — writing the scripts that write the scripts.
	-
	- ## The Automation Mindset
		- Before writing any automation, ask these questions:
		- > [!tip] Is It Worth Automating?
		  > The classic XKCD rule: if the task takes X time and you do it Y times, automation is worth it if `time_to_automate < X × Y − maintenance_cost`.
		  > A 5-minute task done daily = **30 hours/year**. A 2-hour automation script that takes 10 minutes to maintain = breaks even in **day 1**.
		- | Question | If Yes → |
		  |----------|---------|
		  | Is it repetitive? (done more than twice) | Automate it |
		  | Is it error-prone when done manually? | Automate it |
		  | Does it need to happen at a specific time? | Schedule it |
		  | Does it need to scale beyond one person? | Automate it |
		  | Is it a one-off edge case? | Do it manually |
		  | Is it deeply creative/contextual? | Assist with automation, don't replace |
	-
	- ## Automation Knowledge Map
		- ```mermaid
		  mindmap
		    root((Automation))
		      Shell & OS
		        Bash Scripts
		        Cron Jobs
		        Systemd Timers
		        PowerShell
		      Python Automation
		        File & System
		        Web Scraping
		        API Automation
		        PDF & Excel
		        Email & SMS
		      GUI & RPA
		        PyAutoGUI
		        Selenium
		        Robot Framework
		        UiPath
		        Power Automate
		      CI/CD Pipelines
		        GitHub Actions
		        Jenkins
		        GitLab CI
		        ArgoCD GitOps
		      Infrastructure
		        Ansible
		        Terraform
		        SaltStack
		      Workflow Orchestration
		        Celery
		        Kestra
		        Apache Airflow
		      Test Automation
		        pytest
		        Selenium
		        Playwright
		        API Testing
		  ```

- # Shell & OS Automation
  collapsed:: true
	- ## Why Shell Scripting is Automation Foundation
		- [[Shell Script]] is the glue of every Unix/Linux system. Before reaching for Python, ask if a shell script solves it — often it's faster to write and easier to run anywhere (no dependencies, no venv).
		- Shell scripts are best for: piping commands together, file manipulation, process management, environment setup, quick one-liners, and CI/CD pipeline steps.
		- For full [[Shell Script]] reference see [[Shell Script]].
	-
	- ## Bash Automation Patterns
		- ```bash title="automation_template.sh — production-ready script skeleton"
		  #!/usr/bin/env bash
		  # ── Strict mode: fail on errors, undefined vars, and pipe failures ──
		  set -euo pipefail

		  # ── Constants ──────────────────────────────────────────────────────
		  readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
		  readonly SCRIPT_NAME="$(basename "$0")"
		  readonly LOG_FILE="/var/log/${SCRIPT_NAME%.sh}.log"
		  readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

		  # ── Logging ────────────────────────────────────────────────────────
		  log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $*" | tee -a "$LOG_FILE"; }
		  warn() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  $*" | tee -a "$LOG_FILE" >&2; }
		  err()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" | tee -a "$LOG_FILE" >&2; }
		  die()  { err "$*"; exit 1; }

		  # ── Cleanup on exit ────────────────────────────────────────────────
		  cleanup() {
		      local exit_code=$?
		      log "Script exiting with code: $exit_code"
		      # Remove temp files
		      [[ -f "$tmp_file" ]] && rm -f "$tmp_file"
		  }
		  trap cleanup EXIT
		  trap 'die "Signal received, aborting."' INT TERM

		  # ── Argument parsing ───────────────────────────────────────────────
		  usage() {
		      cat <<EOF
		  Usage: $SCRIPT_NAME [OPTIONS]
		    -e, --env ENV       Environment (dev|staging|prod)  [required]
		    -d, --dry-run       Show what would happen, don't act
		    -h, --help          Show this help
		  EOF
		      exit 0
		  }

		  DRY_RUN=false
		  ENV=""
		  while [[ $# -gt 0 ]]; do
		      case "$1" in
		          -e|--env)     ENV="$2";      shift 2 ;;
		          -d|--dry-run) DRY_RUN=true;  shift   ;;
		          -h|--help)    usage                   ;;
		          *)            die "Unknown option: $1" ;;
		      esac
		  done

		  [[ -z "$ENV" ]] && die "--env is required"

		  # ── Dependency check ───────────────────────────────────────────────
		  check_deps() {
		      local deps=("curl" "jq" "aws")
		      for dep in "${deps[@]}"; do
		          command -v "$dep" &>/dev/null || die "Required tool not found: $dep"
		      done
		  }

		  # ── Main logic ─────────────────────────────────────────────────────
		  main() {
		      check_deps
		      log "Starting deployment to $ENV"

		      if $DRY_RUN; then
		          log "[DRY RUN] Would deploy to $ENV"
		          return 0
		      fi

		      log "Deploying..."
		      # actual work here
		  }

		  main "$@"
		  ```
	-
	- ## Cron Jobs — Time-Based Scheduling
		- Cron is the classic Unix task scheduler. It runs commands at specified times — from every minute to once a year. It lives on every Linux server with zero dependencies.
		- ```bash title="cron syntax and examples"
		  # Edit cron table for current user
		  crontab -e

		  # List current cron jobs
		  crontab -l

		  # ── Cron syntax ────────────────────────────────────────────────────
		  # ┌─────────── minute       (0–59)
		  # │ ┌─────────── hour         (0–23)
		  # │ │ ┌─────────── day of month (1–31)
		  # │ │ │ ┌─────────── month        (1–12)
		  # │ │ │ │ ┌─────────── day of week  (0–7, 0=Sun)
		  # │ │ │ │ │
		  # * * * * *  command

		  # Every minute
		  * * * * * /usr/local/bin/check_disk.sh

		  # Every day at 2:30 AM
		  30 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

		  # Every Monday at 9:00 AM
		  0 9 * * 1 /usr/local/bin/weekly_report.sh

		  # Every 15 minutes
		  */15 * * * * /usr/local/bin/health_check.sh

		  # First day of every month at midnight
		  0 0 1 * * /usr/local/bin/monthly_cleanup.sh

		  # Every weekday at 8 AM and 6 PM
		  0 8,18 * * 1-5 /usr/local/bin/sync_data.sh

		  # ── Best practices ─────────────────────────────────────────────────
		  # Always use full paths in cron (PATH is minimal)
		  # Always redirect output:  >> /var/log/job.log 2>&1
		  # Use MAILTO="" to suppress email if no mail server
		  # Use flock for jobs that must not overlap:
		  */5 * * * * flock -n /tmp/myjob.lock /usr/local/bin/myjob.sh
		  ```
	-
	- ## Systemd Timers — Modern Cron Replacement
		- Systemd timers (covered in [[Linux Advanced]]) are more powerful than cron — they log to journald, support dependencies, retry on failure, and handle boot-time catchup.
		- ```ini title="/etc/systemd/system/backup.timer"
		  [Unit]
		  Description=Daily database backup timer

		  [Timer]
		  OnCalendar=*-*-* 02:30:00    # every day at 2:30 AM
		  RandomizedDelaySec=600        # add random 0-10 min delay (spread load)
		  Persistent=true               # run missed jobs after reboot

		  [Install]
		  WantedBy=timers.target
		  ```
		- ```ini title="/etc/systemd/system/backup.service"
		  [Unit]
		  Description=Database backup service
		  After=network.target

		  [Service]
		  Type=oneshot
		  User=backup
		  ExecStart=/usr/local/bin/backup.sh
		  StandardOutput=journal
		  StandardError=journal
		  ```
		- ```bash title="Systemd timer commands"
		  systemctl enable --now backup.timer
		  systemctl list-timers                    # all active timers + next trigger
		  systemctl status backup.timer
		  journalctl -u backup.service --since today  # logs from the service
		  systemctl start backup.service           # run immediately (test)
		  ```
	-
	- ## Parallel Processing in Shell
		- ```bash title="Running multiple tasks in parallel"
		  # Method 1: Background jobs with wait
		  process_server() {
		      local server="$1"
		      ssh "$server" "apt update && apt upgrade -y" &
		  }

		  servers=("web1" "web2" "web3" "web4")
		  for server in "${servers[@]}"; do
		      process_server "$server"
		  done
		  wait   # wait for all background jobs to complete
		  echo "All servers updated"

		  # Method 2: GNU Parallel (smarter — handles concurrency limits)
		  cat servers.txt | parallel -j 4 ssh {} "apt update && apt upgrade -y"
		  # -j 4 = max 4 concurrent jobs

		  # Method 3: xargs -P
		  cat servers.txt | xargs -P 4 -I{} ssh {} "systemctl restart nginx"
		  ```

- # Python Automation
  collapsed:: true
	- ## Why Python Dominates Automation
		- [[Python]] is the premier automation language because:
			- Rich standard library (`os`, `shutil`, `pathlib`, `subprocess`, `schedule`)
			- Massive ecosystem of automation libraries (Selenium, PyAutoGUI, Requests, Paramiko)
			- Readable syntax — automation scripts are often written once, read many times
			- Cross-platform — same script runs on Linux, macOS, and Windows
			- Easy integration with APIs, databases, cloud SDKs
	-
	- ## File & System Automation
		- ```python title="file_automation.py — comprehensive file operations"
		  import os
		  import shutil
		  import pathlib
		  import hashlib
		  from datetime import datetime, timedelta

		  # ── Modern path handling with pathlib ──────────────────────────────
		  base = pathlib.Path("/data/reports")

		  # Create directory tree
		  (base / "archive" / "2024").mkdir(parents=True, exist_ok=True)

		  # Find all PDF files recursively
		  pdfs = list(base.rglob("*.pdf"))

		  # Rename files with timestamp prefix
		  for pdf in pdfs:
		      new_name = pdf.parent / f"{datetime.now():%Y%m%d}_{pdf.name}"
		      pdf.rename(new_name)

		  # ── Bulk file operations ───────────────────────────────────────────
		  def organize_downloads(downloads_dir: str, output_dir: str) -> dict:
		      """Sort files into folders by extension."""
		      downloads = pathlib.Path(downloads_dir)
		      output    = pathlib.Path(output_dir)
		      stats     = {"moved": 0, "skipped": 0}

		      type_map = {
		          "images":    {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
		          "documents": {".pdf", ".docx", ".xlsx", ".pptx", ".txt", ".md"},
		          "videos":    {".mp4", ".mkv", ".avi", ".mov"},
		          "archives":  {".zip", ".tar.gz", ".7z", ".rar"},
		          "code":      {".py", ".js", ".ts", ".go", ".rs", ".cpp"},
		      }

		      for file in downloads.iterdir():
		          if not file.is_file():
		              continue
		          # Find category for this extension
		          category = next(
		              (cat for cat, exts in type_map.items() if file.suffix.lower() in exts),
		              "misc"
		          )
		          dest_dir = output / category
		          dest_dir.mkdir(exist_ok=True)
		          dest     = dest_dir / file.name

		          # Handle duplicates by appending counter
		          counter = 1
		          while dest.exists():
		              dest = dest_dir / f"{file.stem}_{counter}{file.suffix}"
		              counter += 1

		          shutil.move(str(file), str(dest))
		          stats["moved"] += 1

		      return stats

		  # ── Clean up old files ─────────────────────────────────────────────
		  def delete_old_files(directory: str, days_old: int, dry_run: bool = True) -> list:
		      """Delete files older than N days."""
		      cutoff  = datetime.now() - timedelta(days=days_old)
		      deleted = []
		      for file in pathlib.Path(directory).rglob("*"):
		          if file.is_file():
		              modified = datetime.fromtimestamp(file.stat().st_mtime)
		              if modified < cutoff:
		                  if not dry_run:
		                      file.unlink()
		                  deleted.append(str(file))
		      return deleted

		  # ── File integrity checking ────────────────────────────────────────
		  def checksum(filepath: str, algorithm: str = "sha256") -> str:
		      h = hashlib.new(algorithm)
		      with open(filepath, "rb") as f:
		          for chunk in iter(lambda: f.read(65536), b""):
		              h.update(chunk)
		      return h.hexdigest()
		  ```
	-
	- ## subprocess — Run System Commands from Python
		- ```python title="subprocess_automation.py — running system commands safely"
		  import subprocess
		  import shlex

		  # ── Simple command ─────────────────────────────────────────────────
		  result = subprocess.run(
		      ["git", "log", "--oneline", "-10"],
		      capture_output=True,
		      text=True,
		      check=True       # raises CalledProcessError if exit code != 0
		  )
		  print(result.stdout)

		  # ── Run with timeout ───────────────────────────────────────────────
		  try:
		      result = subprocess.run(
		          ["ping", "-c", "4", "google.com"],
		          capture_output=True, text=True,
		          timeout=10     # raise TimeoutExpired after 10 seconds
		      )
		  except subprocess.TimeoutExpired:
		      print("Command timed out")
		  except subprocess.CalledProcessError as e:
		      print(f"Failed with code {e.returncode}: {e.stderr}")

		  # ── Stream output in real time ─────────────────────────────────────
		  def run_streaming(cmd: list[str]) -> int:
		      """Run command and print output line by line as it arrives."""
		      process = subprocess.Popen(
		          cmd,
		          stdout=subprocess.PIPE,
		          stderr=subprocess.STDOUT,
		          text=True,
		          bufsize=1
		      )
		      for line in process.stdout:
		          print(line, end="")
		      process.wait()
		      return process.returncode

		  # ── SSH remote commands via subprocess ─────────────────────────────
		  def ssh_run(host: str, command: str, user: str = "ubuntu") -> str:
		      """Run a command on a remote server over SSH."""
		      result = subprocess.run(
		          ["ssh", "-o", "StrictHostKeyChecking=no", f"{user}@{host}", command],
		          capture_output=True, text=True, check=True
		      )
		      return result.stdout.strip()

		  # Usage:
		  # output = ssh_run("192.168.1.10", "uptime")
		  # output = ssh_run("192.168.1.10", "systemctl restart nginx")
		  ```
	-
	- ## API Automation
		- ```python title="api_automation.py — HTTP client with retry, auth, and error handling"
		  import time
		  import requests
		  from requests.adapters import HTTPAdapter
		  from urllib3.util.retry import Retry
		  from typing import Any

		  # ── Resilient HTTP session ─────────────────────────────────────────
		  def make_session(retries: int = 3, backoff: float = 0.5) -> requests.Session:
		      """Create a requests session with automatic retry on transient errors."""
		      session = requests.Session()
		      retry = Retry(
		          total=retries,
		          backoff_factor=backoff,       # wait 0.5s, 1s, 2s between retries
		          status_forcelist=[429, 500, 502, 503, 504],
		          allowed_methods=["GET", "POST", "PUT"]
		      )
		      adapter = HTTPAdapter(max_retries=retry)
		      session.mount("https://", adapter)
		      session.mount("http://", adapter)
		      return session

		  # ── REST API client ────────────────────────────────────────────────
		  class APIClient:
		      def __init__(self, base_url: str, token: str):
		          self.session = make_session()
		          self.session.headers.update({
		              "Authorization": f"Bearer {token}",
		              "Content-Type":  "application/json",
		              "Accept":        "application/json",
		          })
		          self.base_url = base_url.rstrip("/")

		      def get(self, path: str, **params) -> Any:
		          resp = self.session.get(f"{self.base_url}/{path}", params=params, timeout=30)
		          resp.raise_for_status()
		          return resp.json()

		      def post(self, path: str, data: dict) -> Any:
		          resp = self.session.post(f"{self.base_url}/{path}", json=data, timeout=30)
		          resp.raise_for_status()
		          return resp.json()

		      def paginate(self, path: str, page_key: str = "page") -> list:
		          """Fetch all pages from a paginated endpoint."""
		          results, page = [], 1
		          while True:
		              data = self.get(path, **{page_key: page})
		              items = data.get("results") or data.get("items") or data
		              if not items:
		                  break
		              results.extend(items)
		              if not data.get("next"):   # no next page link
		                  break
		              page += 1
		          return results

		  # ── Rate limiting ──────────────────────────────────────────────────
		  class RateLimitedAPI(APIClient):
		      """Respect API rate limits by adding delays."""
		      def __init__(self, base_url: str, token: str, calls_per_second: float = 2):
		          super().__init__(base_url, token)
		          self.min_interval = 1.0 / calls_per_second
		          self._last_call   = 0.0

		      def _throttle(self):
		          elapsed = time.time() - self._last_call
		          if elapsed < self.min_interval:
		              time.sleep(self.min_interval - elapsed)
		          self._last_call = time.time()

		      def get(self, path: str, **params):
		          self._throttle()
		          return super().get(path, **params)
		  ```
	-
	- ## Email Automation
		- ```python title="email_automation.py — send emails with attachments"
		  import smtplib
		  import os
		  from email.mime.multipart import MIMEMultipart
		  from email.mime.text      import MIMEText
		  from email.mime.base      import MIMEBase
		  from email               import encoders
		  from pathlib             import Path

		  def send_email(
		      to:          list[str],
		      subject:     str,
		      body_html:   str,
		      attachments: list[str] = None,
		      cc:          list[str] = None,
		  ) -> None:
		      """Send an HTML email with optional attachments via SMTP."""
		      smtp_host = os.environ["SMTP_HOST"]
		      smtp_port = int(os.environ.get("SMTP_PORT", 587))
		      smtp_user = os.environ["SMTP_USER"]
		      smtp_pass = os.environ["SMTP_PASS"]

		      msg            = MIMEMultipart("alternative")
		      msg["Subject"] = subject
		      msg["From"]    = smtp_user
		      msg["To"]      = ", ".join(to)
		      if cc:
		          msg["Cc"]  = ", ".join(cc)

		      msg.attach(MIMEText(body_html, "html"))

		      for path in (attachments or []):
		          p    = Path(path)
		          part = MIMEBase("application", "octet-stream")
		          part.set_payload(p.read_bytes())
		          encoders.encode_base64(part)
		          part.add_header("Content-Disposition", f'attachment; filename="{p.name}"')
		          msg.attach(part)

		      all_recipients = to + (cc or [])
		      with smtplib.SMTP(smtp_host, smtp_port) as server:
		          server.starttls()
		          server.login(smtp_user, smtp_pass)
		          server.sendmail(smtp_user, all_recipients, msg.as_string())

		  # Usage:
		  # send_email(
		  #     to=["manager@company.com"],
		  #     subject="Weekly Report",
		  #     body_html="<h1>Sales Report</h1><p>See attachment.</p>",
		  #     attachments=["report.xlsx"]
		  # )
		  ```
	-
	- ## Excel & PDF Automation
		- ```python title="spreadsheet_automation.py — automate Excel reports"
		  import openpyxl
		  from openpyxl.styles import Font, PatternFill, Alignment
		  from openpyxl.chart import BarChart, Reference
		  from openpyxl.utils import get_column_letter
		  import pandas as pd

		  # ── pandas for data processing ─────────────────────────────────────
		  df = pd.read_csv("sales_data.csv")
		  summary = (
		      df.groupby("product")
		        .agg(total_sales=("amount", "sum"), orders=("order_id", "count"))
		        .reset_index()
		        .sort_values("total_sales", ascending=False)
		  )

		  # ── openpyxl for formatted Excel output ────────────────────────────
		  wb = openpyxl.Workbook()
		  ws = wb.active
		  ws.title = "Sales Summary"

		  # Header row with styling
		  headers = ["Product", "Total Sales ($)", "Order Count"]
		  header_fill = PatternFill(fill_type="solid", fgColor="2196F3")
		  header_font = Font(bold=True, color="FFFFFF")

		  for col, header in enumerate(headers, start=1):
		      cell           = ws.cell(row=1, column=col, value=header)
		      cell.fill      = header_fill
		      cell.font      = header_font
		      cell.alignment = Alignment(horizontal="center")

		  # Data rows
		  for row_idx, row in enumerate(summary.itertuples(), start=2):
		      ws.cell(row=row_idx, column=1, value=row.product)
		      ws.cell(row=row_idx, column=2, value=row.total_sales)
		      ws.cell(row=row_idx, column=3, value=row.orders)

		  # Auto-size columns
		  for col in ws.columns:
		      max_len = max(len(str(cell.value or "")) for cell in col) + 2
		      ws.column_dimensions[get_column_letter(col[0].column)].width = max_len

		  # Add bar chart
		  chart = BarChart()
		  chart.title = "Sales by Product"
		  data = Reference(ws, min_col=2, min_row=1, max_row=len(summary) + 1)
		  cats = Reference(ws, min_col=1, min_row=2, max_row=len(summary) + 1)
		  chart.add_data(data, titles_from_data=True)
		  chart.set_categories(cats)
		  ws.add_chart(chart, "E2")

		  wb.save("sales_report.xlsx")
		  ```
	-
	- ## Task Scheduling in Python
		- ```python title="scheduler.py — in-process task scheduling"
		  import schedule
		  import time
		  import threading
		  import logging
		  from datetime import datetime

		  logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
		  log = logging.getLogger(__name__)

		  # ── Define tasks ───────────────────────────────────────────────────
		  def backup_database():
		      log.info("Starting database backup...")
		      # ... backup logic ...
		      log.info("Database backup complete.")

		  def send_daily_report():
		      log.info("Generating daily report...")
		      # ... report logic ...

		  def cleanup_temp_files():
		      log.info("Cleaning temp files...")
		      import shutil, pathlib
		      for f in pathlib.Path("/tmp").glob("myapp_*"):
		          f.unlink(missing_ok=True)

		  def health_check():
		      import requests
		      try:
		          requests.get("https://myapp.com/health", timeout=5).raise_for_status()
		          log.info("Health check: OK")
		      except Exception as e:
		          log.error(f"Health check FAILED: {e}")
		          # send alert here

		  # ── Schedule tasks ─────────────────────────────────────────────────
		  schedule.every().day.at("02:30").do(backup_database)
		  schedule.every().day.at("09:00").do(send_daily_report)
		  schedule.every(10).minutes.do(cleanup_temp_files)
		  schedule.every(5).minutes.do(health_check)
		  schedule.every().monday.at("08:00").do(send_daily_report)   # weekly too

		  # ── Run with error isolation ───────────────────────────────────────
		  def run_job_safely(job):
		      """Wrapper so one failing job doesn't crash the scheduler."""
		      try:
		          job()
		      except Exception as e:
		          log.error(f"Job {job.__name__} failed: {e}", exc_info=True)

		  # Wrap all jobs
		  for job in schedule.jobs:
		      original_func = job.job_func
		      job.job_func  = lambda f=original_func: run_job_safely(f)

		  log.info("Scheduler started. Press Ctrl+C to stop.")
		  while True:
		      schedule.run_pending()
		      time.sleep(1)
		  ```

- # Web Automation & Scraping
  collapsed:: true
	- ## Selenium — Browser Automation
		- [[Selenium]] automates real web browsers (Chrome, Firefox) — it clicks buttons, fills forms, navigates pages, and extracts data exactly like a human would. Essential for automating web apps that require JavaScript, login, or complex interactions.
		- See [[Selenium]] for the full dedicated reference page.
		- ```python title="selenium_automation.py — robust browser automation"
		  from selenium import webdriver
		  from selenium.webdriver.common.by import By
		  from selenium.webdriver.common.keys import Keys
		  from selenium.webdriver.support.ui import WebDriverWait
		  from selenium.webdriver.support import expected_conditions as EC
		  from selenium.webdriver.chrome.options import Options
		  from selenium.common.exceptions import TimeoutException, NoSuchElementException
		  import time

		  def make_driver(headless: bool = True) -> webdriver.Chrome:
		      """Create a configured Chrome WebDriver."""
		      options = Options()
		      if headless:
		          options.add_argument("--headless=new")
		      options.add_argument("--no-sandbox")
		      options.add_argument("--disable-dev-shm-usage")
		      options.add_argument("--window-size=1920,1080")
		      options.add_argument("--user-agent=Mozilla/5.0 ...")
		      return webdriver.Chrome(options=options)

		  def wait_for(driver, by, value, timeout=10):
		      """Wait for an element to be clickable."""
		      return WebDriverWait(driver, timeout).until(
		          EC.element_to_be_clickable((by, value))
		      )

		  # ── Example: automate a login + data extraction ────────────────────
		  driver = make_driver(headless=False)
		  wait   = WebDriverWait(driver, 10)

		  try:
		      driver.get("https://example.com/login")

		      # Fill login form
		      wait.until(EC.presence_of_element_located((By.ID, "email")))
		      driver.find_element(By.ID, "email").send_keys("user@example.com")
		      driver.find_element(By.ID, "password").send_keys("mypassword", Keys.RETURN)

		      # Wait for dashboard to load
		      wait.until(EC.url_contains("/dashboard"))

		      # Extract table data
		      rows = driver.find_elements(By.CSS_SELECTOR, "table#reports tbody tr")
		      data = []
		      for row in rows:
		          cells = row.find_elements(By.TAG_NAME, "td")
		          data.append([cell.text for cell in cells])

		      # Take a screenshot for verification
		      driver.save_screenshot("dashboard.png")
		      print(f"Extracted {len(data)} rows")

		  except TimeoutException as e:
		      print(f"Timed out waiting for element: {e}")
		  finally:
		      driver.quit()
		  ```
	-
	- ## BeautifulSoup + Requests — Static Web Scraping
		- For static pages (no JavaScript needed), [[Selenium]] is overkill. `requests` + `BeautifulSoup` is faster, lighter, and simpler.
		- ```python title="scraper.py — polite web scraper"
		  import requests
		  from bs4 import BeautifulSoup
		  import time
		  import csv
		  from urllib.parse import urljoin, urlparse

		  class WebScraper:
		      def __init__(self, base_url: str, delay: float = 1.0):
		          self.base_url = base_url
		          self.delay    = delay   # be polite — don't hammer the server
		          self.session  = requests.Session()
		          self.session.headers["User-Agent"] = "MyBot/1.0 (educational)"
		          self.visited: set[str] = set()

		      def get_soup(self, url: str) -> BeautifulSoup | None:
		          if url in self.visited:
		              return None
		          self.visited.add(url)
		          time.sleep(self.delay)   # rate limiting
		          try:
		              resp = self.session.get(url, timeout=10)
		              resp.raise_for_status()
		              return BeautifulSoup(resp.text, "html.parser")
		          except requests.RequestException as e:
		              print(f"Failed: {url} — {e}")
		              return None

		      def scrape_articles(self, url: str) -> list[dict]:
		          soup = self.get_soup(url)
		          if not soup:
		              return []
		          articles = []
		          for article in soup.select("article.post"):
		              title = article.select_one("h2 a")
		              date  = article.select_one("time")
		              link  = title["href"] if title else ""
		              articles.append({
		                  "title": title.text.strip() if title else "",
		                  "date":  date.get("datetime", "") if date else "",
		                  "url":   urljoin(self.base_url, link),
		              })
		          return articles

		      def to_csv(self, data: list[dict], filename: str):
		          if not data:
		              return
		          with open(filename, "w", newline="", encoding="utf-8") as f:
		              writer = csv.DictWriter(f, fieldnames=data[0].keys())
		              writer.writeheader()
		              writer.writerows(data)
		          print(f"Saved {len(data)} rows to {filename}")
		  ```
	-
	- ## Scrapy — Production Web Scraping
		- [[Scrapy]] is a full async scraping framework — built-in concurrency, middleware, pipelines, item processors, and crawl scheduling. For large-scale scraping jobs, not quick one-offs. See [[Scrapy]] for the full reference.
		- ```python title="myspider.py — Scrapy spider skeleton"
		  import scrapy
		  from scrapy.crawler import CrawlerProcess

		  class ArticleSpider(scrapy.Spider):
		      name            = "articles"
		      allowed_domains = ["news.example.com"]
		      start_urls      = ["https://news.example.com/tech"]

		      custom_settings = {
		          "DOWNLOAD_DELAY":            1,      # polite crawl delay
		          "CONCURRENT_REQUESTS":       8,
		          "FEEDS": {"articles.json": {"format": "json", "overwrite": True}},
		      }

		      def parse(self, response):
		          # Extract article links from listing page
		          for link in response.css("article h2 a::attr(href)").getall():
		              yield response.follow(link, callback=self.parse_article)

		          # Follow pagination
		          next_page = response.css("a.next::attr(href)").get()
		          if next_page:
		              yield response.follow(next_page, callback=self.parse)

		      def parse_article(self, response):
		          yield {
		              "title":   response.css("h1::text").get("").strip(),
		              "date":    response.css("time::attr(datetime)").get(""),
		              "content": " ".join(response.css("article p::text").getall()),
		              "url":     response.url,
		          }

		  # Run directly
		  if __name__ == "__main__":
		      process = CrawlerProcess()
		      process.crawl(ArticleSpider)
		      process.start()
		  ```

- # GUI & Desktop Automation (RPA)
  collapsed:: true
	- ## What is RPA
		- **Robotic Process Automation (RPA)** automates interactions with graphical user interfaces — clicking buttons, typing into fields, reading data from screens — in applications that have no API.
		- Think of it as a robot that operates software the same way a human does, but faster, without breaks, and without typos.
		- Use cases: legacy ERP systems, government portals, invoice processing, data entry between systems that don't integrate, automated report generation from desktop tools.
		- > [!warning] RPA vs API
		  > Always prefer API automation when available. RPA breaks when the UI changes (a button moves, a color scheme updates). APIs are far more stable. Use RPA only when no API exists.
	-
	- ## PyAutoGUI — Cross-Platform GUI Automation
		- [[PyAutoGUI]] controls the mouse and keyboard programmatically on Windows, macOS, and Linux. See [[PyAutoGUI]] for the full reference.
		- ```python title="pyautogui_automation.py — desktop GUI automation"
		  import pyautogui
		  import time
		  import subprocess

		  # Safety: move mouse to top-left corner to abort
		  pyautogui.FAILSAFE = True
		  pyautogui.PAUSE    = 0.5    # add 0.5s pause between every action

		  # ── Open application ───────────────────────────────────────────────
		  subprocess.Popen(["notepad.exe"])   # Windows example
		  time.sleep(1.5)                     # wait for app to open

		  # ── Type text ──────────────────────────────────────────────────────
		  pyautogui.write("Hello, Automation!", interval=0.05)  # type with delay
		  pyautogui.hotkey("ctrl", "a")    # Ctrl+A (select all)
		  pyautogui.hotkey("ctrl", "c")    # copy

		  # ── Click by position ──────────────────────────────────────────────
		  pyautogui.click(x=200, y=150)           # click at coordinates
		  pyautogui.doubleClick(x=500, y=300)     # double click
		  pyautogui.rightClick(x=500, y=300)      # right click

		  # ── Find and click by image ────────────────────────────────────────
		  # Takes a screenshot of the screen and finds the template image
		  button_pos = pyautogui.locateCenterOnScreen("save_button.png", confidence=0.9)
		  if button_pos:
		      pyautogui.click(button_pos)
		  else:
		      print("Button not found on screen")

		  # ── Screenshot + OCR combo (for data extraction) ──────────────────
		  screenshot = pyautogui.screenshot(region=(0, 0, 800, 600))  # x,y,w,h
		  screenshot.save("screen_capture.png")
		  # Then use pytesseract or easyocr to read text from the image

		  # ── Scroll and drag ────────────────────────────────────────────────
		  pyautogui.scroll(-3, x=500, y=400)       # scroll down 3 clicks
		  pyautogui.dragTo(700, 400, duration=0.5)  # drag to position
		  ```
	-
	- ## Watchdog — File System Event Automation
		- [[Watchdog]] monitors file system changes and triggers Python code when files are created, modified, or deleted. Perfect for hot-reload systems, automated file processing, and monitoring directories.
		- See [[Watchdog]] for the dedicated reference page.
		- ```python title="watchdog_automation.py — react to file changes"
		  import time
		  from pathlib import Path
		  from watchdog.observers import Observer
		  from watchdog.events    import FileSystemEventHandler, FileCreatedEvent

		  class InvoiceProcessor(FileSystemEventHandler):
		      """Process new PDF invoices automatically when they appear."""

		      WATCH_DIR = Path("/data/incoming-invoices")
		      DONE_DIR  = Path("/data/processed-invoices")
		      FAIL_DIR  = Path("/data/failed-invoices")

		      def on_created(self, event: FileCreatedEvent):
		          if event.is_directory:
		              return
		          path = Path(event.src_path)
		          if path.suffix.lower() != ".pdf":
		              return
		          print(f"New invoice detected: {path.name}")
		          self._process(path)

		      def on_modified(self, event):
		          pass  # ignore modifications

		      def _process(self, path: Path):
		          try:
		              # 1. Wait for file write to complete
		              time.sleep(0.5)
		              # 2. Extract data (parse PDF, OCR, etc.)
		              data = self._extract_invoice_data(path)
		              # 3. Post to ERP API
		              self._submit_to_erp(data)
		              # 4. Move to done
		              self.DONE_DIR.mkdir(exist_ok=True)
		              path.rename(self.DONE_DIR / path.name)
		              print(f"Processed: {path.name}")
		          except Exception as e:
		              print(f"Failed {path.name}: {e}")
		              self.FAIL_DIR.mkdir(exist_ok=True)
		              path.rename(self.FAIL_DIR / path.name)

		      def _extract_invoice_data(self, path: Path) -> dict:
		          # Use pdfplumber, pypdf2, or ocr here
		          return {"filename": path.name, "amount": 0.0}

		      def _submit_to_erp(self, data: dict):
		          import requests
		          requests.post("https://erp.company.com/api/invoices", json=data, timeout=10)

		  # Start watching
		  observer = Observer()
		  handler  = InvoiceProcessor()
		  observer.schedule(handler, str(handler.WATCH_DIR), recursive=False)
		  observer.start()
		  print(f"Watching {handler.WATCH_DIR} for new invoices...")
		  try:
		      while True:
		          time.sleep(1)
		  except KeyboardInterrupt:
		      observer.stop()
		  observer.join()
		  ```

- # Background Task & Queue Automation
  collapsed:: true
	- ## Why Task Queues
		- Some tasks are too slow for a web request (sending emails, processing images, calling external APIs, generating reports) and some tasks need to run across many workers in parallel.
		- A **task queue** decouples the web server from the work: web request says "do this later" and returns immediately; a background worker picks it up and processes it asynchronously.
	-
	- ## Celery — Distributed Task Queue
		- [[Celery]] is the standard [[Python]] distributed task queue. Tasks are defined as decorated functions, sent to a broker (Redis or RabbitMQ), and executed by worker processes — potentially on different machines. See [[Celery]] for the full reference.
		- ```python title="tasks.py — Celery task definitions"
		  from celery import Celery, Task
		  from celery.utils.log import get_task_logger
		  from kombu import Queue
		  import time

		  # ── App setup ──────────────────────────────────────────────────────
		  app = Celery("myapp",
		      broker="redis://localhost:6379/0",
		      backend="redis://localhost:6379/1"
		  )

		  app.conf.update(
		      task_serializer       = "json",
		      result_serializer     = "json",
		      accept_content        = ["json"],
		      timezone              = "UTC",
		      enable_utc            = True,
		      task_track_started    = True,
		      task_acks_late        = True,      # re-queue if worker dies mid-task
		      worker_prefetch_multiplier = 1,    # one task at a time per worker

		      # Route heavy tasks to a dedicated queue
		      task_routes = {
		          "tasks.process_video":   {"queue": "heavy"},
		          "tasks.send_email":      {"queue": "fast"},
		          "tasks.generate_report": {"queue": "reports"},
		      },

		      # Scheduled tasks (Celery Beat)
		      beat_schedule = {
		          "daily-cleanup": {
		              "task":     "tasks.cleanup_old_files",
		              "schedule": 86400,   # every 24 hours (seconds)
		          },
		          "hourly-sync": {
		              "task":     "tasks.sync_with_external_api",
		              "schedule": 3600,
		          },
		      },
		  )

		  log = get_task_logger(__name__)

		  # ── Task definitions ───────────────────────────────────────────────
		  @app.task(bind=True, max_retries=3, default_retry_delay=60)
		  def send_email(self, to: str, subject: str, body: str):
		      """Send email with automatic retry on failure."""
		      try:
		          log.info(f"Sending email to {to}")
		          # ... send email ...
		          return {"status": "sent", "to": to}
		      except Exception as exc:
		          log.warning(f"Email failed, retrying... ({self.request.retries}/3)")
		          raise self.retry(exc=exc)   # exponential backoff

		  @app.task(bind=True, time_limit=300, soft_time_limit=240)
		  def process_video(self, video_path: str, output_dir: str):
		      """Process a video file — hard limit 5 min, soft warning at 4 min."""
		      log.info(f"Processing video: {video_path}")
		      # ... ffmpeg processing ...
		      return {"output": output_dir}

		  @app.task
		  def cleanup_old_files():
		      """Scheduled cleanup — runs every 24 hours via Celery Beat."""
		      import pathlib
		      from datetime import datetime, timedelta
		      cutoff = datetime.now() - timedelta(days=30)
		      deleted = 0
		      for f in pathlib.Path("/tmp/uploads").glob("*"):
		          if datetime.fromtimestamp(f.stat().st_mtime) < cutoff:
		              f.unlink()
		              deleted += 1
		      return {"deleted": deleted}
		  ```
		- ```bash title="Celery worker + beat commands"
		  # Start worker — listens to default queue
		  celery -A tasks worker --loglevel=info

		  # Start worker for specific queues
		  celery -A tasks worker -Q heavy,reports --concurrency=2
		  celery -A tasks worker -Q fast --concurrency=8

		  # Start scheduler (Celery Beat) — triggers periodic tasks
		  celery -A tasks beat --loglevel=info

		  # Start worker + beat together (development only)
		  celery -A tasks worker --beat --loglevel=info

		  # Monitor tasks in terminal
		  celery -A tasks events
		  celery -A tasks flower   # web UI at http://localhost:5555

		  # Inspect running workers
		  celery -A tasks inspect active
		  celery -A tasks inspect stats
		  ```

- # Infrastructure & DevOps Automation
  collapsed:: true
	- ## The Automation Stack
		- Infrastructure automation follows a layered model — each tool specializes in a different layer:
		- ```mermaid
		  graph TD
		      IaC["🏗️ Infrastructure Provisioning\nTerraform · Pulumi · CloudFormation\nCreate: servers, networks, databases, DNS"]
		      Config["⚙️ Configuration Management\nAnsible · SaltStack · Chef · Puppet\nConfigure: packages, files, services, users"]
		      Deploy["🚀 Application Deployment\nDocker · Kubernetes · Helm\nRun: containers, rolling updates, scaling"]
		      CI["🔄 CI/CD Pipeline\nGitHub Actions · Jenkins · GitLab CI\nAutomate: test → build → deploy on every commit"]
		      GitOps["📦 GitOps\nArgoCD · Flux CD\nReconcile: cluster state matches Git"]
		      Workflow["📋 Workflow Orchestration\nKestra · Airflow · Celery\nOrchestrate: multi-step jobs, schedules, events"]
		      IaC --> Config --> Deploy --> CI --> GitOps
		      CI --> Workflow
		  ```
		- For full deep-dives: [[DevOps]] covers the whole stack. [[Ansible]] for configuration management. [[kestra]] for workflow orchestration.
	-
	- ## Makefile — Project Automation Standard
		- A `Makefile` at the root of every project gives developers a consistent interface regardless of language or toolchain. `make test` always runs tests. `make deploy` always deploys.
		- ```makefile title="Makefile — universal project automation"
		  # ── Variables ──────────────────────────────────────────────────────
		  APP_NAME   := myapp
		  IMAGE_TAG  := $(shell git rev-parse --short HEAD)
		  REGISTRY   := ghcr.io/company
		  ENV        ?= dev       # default env, overridable: make deploy ENV=staging

		  .PHONY: help install test lint format build push deploy clean

		  # Default target — show help
		  help:
		  	@echo "Available commands:"
		  	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		  	  awk 'BEGIN{FS=":.*?## "}{printf "  %-15s %s\n",$$1,$$2}'

		  install: ## Install dependencies
		  	pip install -r requirements.txt -r requirements-dev.txt

		  test: ## Run tests with coverage
		  	pytest --cov=src --cov-report=term-missing --cov-fail-under=80

		  lint: ## Run linter (ruff)
		  	ruff check src/ tests/

		  format: ## Auto-format code
		  	ruff format src/ tests/
		  	ruff check --fix src/ tests/

		  build: ## Build Docker image
		  	docker build -t $(REGISTRY)/$(APP_NAME):$(IMAGE_TAG) .
		  	docker tag $(REGISTRY)/$(APP_NAME):$(IMAGE_TAG) $(REGISTRY)/$(APP_NAME):latest

		  push: build ## Build and push Docker image
		  	docker push $(REGISTRY)/$(APP_NAME):$(IMAGE_TAG)
		  	docker push $(REGISTRY)/$(APP_NAME):latest

		  deploy: ## Deploy to environment (make deploy ENV=staging)
		  	kubectl set image deployment/$(APP_NAME) \
		  	  $(APP_NAME)=$(REGISTRY)/$(APP_NAME):$(IMAGE_TAG) \
		  	  -n $(ENV)
		  	kubectl rollout status deployment/$(APP_NAME) -n $(ENV)

		  clean: ## Clean build artifacts
		  	find . -type d -name __pycache__ -exec rm -rf {} +
		  	find . -name "*.pyc" -delete
		  	rm -rf .pytest_cache .coverage dist/ build/ *.egg-info/
		  ```

- # Test Automation
  collapsed:: true
	- ## Types of Test Automation
		- Test automation is one of the most impactful forms of automation — it gives you **confidence to ship fast** without manually checking everything every time.
		- | Test Type | Speed | Scope | Tools |
		  |-----------|-------|-------|-------|
		  | **Unit** | Milliseconds | Single function/class | pytest, unittest, Jest, JUnit |
		  | **Integration** | Seconds | Multiple components, real DB | pytest + testcontainers |
		  | **API / Contract** | Seconds | HTTP endpoints | pytest + requests, Postman |
		  | **End-to-End (E2E)** | Minutes | Full user journey in browser | Selenium, Playwright, Cypress |
		  | **Performance** | Minutes | Load, stress, spike | k6, JMeter, Locust |
		  | **Security (DAST)** | Minutes | Running app vulnerabilities | OWASP ZAP, Burp Suite |
	-
	- ## pytest — Python Test Automation
		- ```python title="test_api.py — comprehensive pytest example"
		  import pytest
		  import requests
		  from unittest.mock import patch, MagicMock

		  # ── Fixtures — reusable test setup ─────────────────────────────────
		  @pytest.fixture(scope="session")
		  def api_base_url():
		      return "http://localhost:8000"

		  @pytest.fixture
		  def auth_headers():
		      """Get a fresh auth token for each test."""
		      resp = requests.post("http://localhost:8000/auth/token",
		                           json={"username": "test", "password": "test"})
		      token = resp.json()["access_token"]
		      return {"Authorization": f"Bearer {token}"}

		  @pytest.fixture
		  def test_user(api_base_url, auth_headers):
		      """Create a user and clean up after the test."""
		      resp = requests.post(f"{api_base_url}/users",
		                           json={"name": "Test User", "email": "test@example.com"},
		                           headers=auth_headers)
		      user = resp.json()
		      yield user   # test runs here
		      # Cleanup — runs even if test fails
		      requests.delete(f"{api_base_url}/users/{user['id']}", headers=auth_headers)

		  # ── Tests ──────────────────────────────────────────────────────────
		  class TestUserAPI:
		      def test_create_user_returns_201(self, api_base_url, auth_headers):
		          resp = requests.post(f"{api_base_url}/users",
		                               json={"name": "Alice", "email": "alice@example.com"},
		                               headers=auth_headers)
		          assert resp.status_code == 201
		          assert resp.json()["email"] == "alice@example.com"

		      def test_get_user(self, api_base_url, auth_headers, test_user):
		          resp = requests.get(f"{api_base_url}/users/{test_user['id']}",
		                              headers=auth_headers)
		          assert resp.status_code == 200
		          assert resp.json()["id"] == test_user["id"]

		      def test_unauthorized_request_returns_401(self, api_base_url):
		          resp = requests.get(f"{api_base_url}/users")
		          assert resp.status_code == 401

		      @pytest.mark.parametrize("invalid_email", [
		          "not-an-email", "@missing-local", "missing-at-sign", ""
		      ])
		      def test_invalid_email_rejected(self, api_base_url, auth_headers, invalid_email):
		          resp = requests.post(f"{api_base_url}/users",
		                               json={"name": "X", "email": invalid_email},
		                               headers=auth_headers)
		          assert resp.status_code == 422

		  # ── Mock external services ─────────────────────────────────────────
		  @patch("myapp.services.email.send_email")
		  def test_registration_sends_welcome_email(mock_send, api_base_url):
		      requests.post(f"{api_base_url}/register",
		                    json={"email": "new@example.com", "password": "secure"})
		      mock_send.assert_called_once()
		      assert mock_send.call_args[1]["to"] == "new@example.com"
		  ```
	-
	- ## Playwright — Modern E2E Browser Testing
		- ```python title="test_checkout.py — Playwright E2E test"
		  import pytest
		  from playwright.sync_api import Page, expect

		  @pytest.fixture(scope="session")
		  def browser_context_args():
		      return {"viewport": {"width": 1280, "height": 720}}

		  def test_user_can_checkout(page: Page):
		      """Full checkout flow end-to-end."""
		      # Navigate and log in
		      page.goto("https://staging.myshop.com")
		      page.click("text=Sign In")
		      page.fill("#email",    "testuser@example.com")
		      page.fill("#password", "testpassword")
		      page.click("button[type=submit]")
		      expect(page).to_have_url(re.compile("/dashboard"))

		      # Add product to cart
		      page.goto("https://staging.myshop.com/products/widget-pro")
		      page.click("button#add-to-cart")
		      expect(page.locator(".cart-count")).to_have_text("1")

		      # Checkout
		      page.click("a#cart-icon")
		      page.click("button#checkout")
		      page.fill("#card-number", "4111111111111111")
		      page.fill("#card-expiry", "12/26")
		      page.fill("#card-cvc",    "123")
		      page.click("button#place-order")

		      # Verify success
		      expect(page.locator("h1")).to_have_text("Order Confirmed")
		      expect(page.locator(".order-number")).to_be_visible()

		      # Screenshot on success
		      page.screenshot(path="checkout_success.png")
		  ```

- # More Learn
	- ## Books
		- [Automate the Boring Stuff with Python — Al Sweigart (free)](https://automatetheboringstuff.com/) — The definitive beginner Python automation book. Completely free online.
		- [Python for DevOps — Noah Gift](https://www.amazon.com/Python-DevOps-Ruthlessly-Effective-Automation/dp/149205769X) — Automation in a professional DevOps context.
		- [Shell Scripting: Expert Recipes — Steve Parker](https://www.amazon.com/Shell-Scripting-Expert-Recipes-Linux/dp/1118024486) — Advanced shell automation patterns.
	-
	- ## Github & Webs
		- [Automate the Boring Stuff — Free online](https://automatetheboringstuff.com/)
		- [Awesome Automation — GitHub](https://github.com/topics/automation) — curated list of automation tools and projects.
		- [n8n — Open Source Workflow Automation](https://n8n.io/) — Visual no-code/low-code automation platform.
		- [Zapier Learning](https://zapier.com/learn/automation/) — high-level automation concepts.
		- [Playwright Docs](https://playwright.dev/python/docs/intro)
		- [Selenium Docs](https://www.selenium.dev/documentation/)
	-
	- ## Explore Further
		- Automation does not live in a vacuum — it amplifies every other discipline. Every page below is something you'll reach for while building real automation systems.
		-
		- **The scripting foundation** — [[Shell Script]] is the first tool to reach for. Bash, text processing with `awk` and `sed`, job control, and process management underpin almost every CI step, Makefile target, and ops script you'll write. Before Python, ask if a shell one-liner solves it.
		-
		- **The automation language** — [[Python]] is the premier language for anything more complex than shell can handle cleanly: file processing, API clients, Excel reports, scheduled tasks, and all the automation patterns in this page. Its ecosystem for automation is unmatched.
		-
		- **When automation becomes infrastructure** — [[DevOps]] is where personal automation scripts become team-wide CI/CD pipelines, IaC, and GitOps workflows. Read it to understand how the Makefile and Ansible snippets in this page fit into a production engineering organization.
		-
		- **Configuration management at scale** — [[Ansible]] is how you automate the *configuration* of servers and applications across a fleet — not just scripts on one machine. Agentless, YAML-based, and idempotent. [[SaltStack]] adds an event-driven model on top, reacting to infrastructure changes automatically. Both are covered from this page's automation perspective and in depth on their own pages.
		-
		- **Complex multi-step workflow orchestration** — [[kestra]] handles the jobs that outgrow cron and simple scripts: parallel ETL pipelines, multi-step infra automation, AI workflows, and event-triggered sequences with retries and error handling — all in YAML with 1400+ plugins.
		-
		- **Background task queues** — [[Celery]] is the Python standard for distributing work across multiple worker processes: sending emails, processing uploads, running ML inference, and any job too slow for a web request. Its dedicated page covers workers, routing, Celery Beat scheduling, and monitoring with Flower.
		-
		- **Browser and GUI automation** — [[Selenium]] is the battle-tested standard for automating real browsers — login flows, data extraction from JavaScript-heavy pages, and end-to-end testing. [[PyAutoGUI]] goes further and controls the entire desktop: mouse, keyboard, and screen — for apps with no API at all.
		-
		- **Reacting to file system changes** — [[Watchdog]] monitors directories for new or modified files and triggers Python code instantly — the right tool for invoice processors, hot-reload systems, and automated file pipelines.
		-
		- **Large-scale web scraping** — [[Scrapy]] is the production framework for scraping at scale: async crawling, pipelines, middleware, and scheduling. Its own page covers spiders, item processors, and deployment.
		-
		- **Pipeline automation** — [[GitHub Actions]] triggers automation on every git push, pull request, or schedule. [[GitLab CI]] does the same for GitLab-hosted projects with strong built-in environments. [[Jenkins]] gives maximum flexibility for self-hosted, complex pipeline graphs.
		-
		- **The OS layer** — [[Linux Advanced]] covers the cron daemon, systemd timers, shell internals, and process management — everything that runs your scheduled automation jobs in production.
		-
		- **The systems your automation serves** — [[System Design]] provides the architectural context: why you need background queues, why distributed workers exist, and how automated systems fit into larger architectures.
		-
		- **Automating ML pipelines** — [[Machine Learning]] covers training pipelines, feature engineering workflows, and MLOps — a specialized and growing domain of automation that connects directly to the patterns on this page.
	-
	- ## Master Playlists YouTube
		- [Automate with Python — Corey Schafer](https://www.youtube.com/results?search_query=python+automation+corey+schafer)
		- [Shell Scripting Full Course](https://www.youtube.com/results?search_query=bash+shell+scripting+full+course)
		- [Selenium Python Full Course](https://www.youtube.com/results?search_query=selenium+python+full+course+automation)
		- [Playwright Python Tutorial](https://www.youtube.com/results?search_query=playwright+python+automation+tutorial)
		- [Celery Django Redis Tutorial](https://www.youtube.com/results?search_query=celery+django+redis+full+tutorial)
		- [GitHub Actions Full Course](https://www.youtube.com/results?search_query=github+actions+full+course+automation)
		- [Ansible Automation Full Course](https://www.youtube.com/results?search_query=ansible+automation+full+course+beginners)
