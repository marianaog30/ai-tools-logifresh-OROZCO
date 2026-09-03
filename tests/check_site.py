"""Comprueba recursos estáticos y coincidencia byte a byte del sitio servido."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen

base=Path(__file__).resolve().parents[1]
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8765/'
class Links(HTMLParser):
    def __init__(self): super().__init__(); self.targets=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for key in ['src','href']:
            if key in a and not a[key].startswith(('data:','#')): self.targets.append(a[key])
parser=Links(); parser.feed((base/'index.html').read_text())
targets=sorted(set(['./index.html']+parser.targets))
results=[]
for target in targets:
    assert not urlparse(target).scheme and not target.startswith('/'),target
    path=base/(target.removeprefix('./') or 'index.html')
    if path.is_dir(): path=path/'index.html'
    assert path.is_file(),path
    with urlopen(urljoin(url,target),timeout=20) as response:
        body=response.read()
        assert response.status==200
        assert body==path.read_bytes(),target+' difiere del archivo local'
        results.append(dict(target=target,status=response.status,bytes=len(body),sha256=hashlib.sha256(body).hexdigest()))
output=dict(url=url,status='PASS',resources=results,scope='HTTP y coincidencia de contenido; no sustituye pruebas de interacción')
name='public-resources.json' if not urlparse(url).hostname in ['localhost','127.0.0.1'] else 'local-resources.json'
(base/'tests'/name).write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(output,ensure_ascii=False,indent=2))
