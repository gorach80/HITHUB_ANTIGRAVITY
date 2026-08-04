import os
import subprocess
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

url = 'https://saberescincopuntocero.com/cv1526/'
base_url = 'https://saberescincopuntocero.com'
output_dir = 'c:/Users/luisa/Documents/HITHUB_ANTIGRAVITY/SABERES 5.0'

os.makedirs(output_dir, exist_ok=True)
visited = set()

def sanitize_filename(url):
    parsed = urlparse(url)
    path = parsed.path
    if not path or path == '/':
        return 'index.html'
    if path.endswith('/'):
        path += 'index.html'
    elif '.' not in path.split('/')[-1]:
        path += '/index.html'
    return path.lstrip('/')

def download_page(page_url):
    if page_url in visited or not page_url.startswith(base_url):
        return
    visited.add(page_url)
    print(f"Downloading {page_url}...")
    try:
        result = subprocess.run(
            ['curl.exe', '-A', 'Mozilla/5.0', '-L', '-s', page_url],
            capture_output=True,
            check=True
        )
        content = result.stdout
    except Exception as e:
        print(f"Failed to get {page_url}: {e}")
        return

    # Try parsing as HTML to find links if it looks like HTML or has no extension
    if b'<html' in content.lower():
        try:
            text_content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(text_content, 'html.parser')
            
            # Process links to other pages
            for a in soup.find_all('a', href=True):
                href = a['href']
                full_url = urljoin(page_url, href)
                if full_url.startswith(base_url):
                    local_path = sanitize_filename(full_url)
                    a['href'] = '/' + local_path
                    if page_url == url:
                        download_page(full_url)
            
            content = soup.prettify().encode('utf-8', errors='ignore')
        except Exception as e:
            pass
            
    local_path = sanitize_filename(page_url)
    file_path = os.path.join(output_dir, local_path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'wb') as f:
        f.write(content)

download_page(url)
print("Download complete.")

