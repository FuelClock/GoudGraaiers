#!/usr/bin/env python3
"""Tiny Jekyll-ish renderer for local preview of the Goud Graaiers site.
Supports: frontmatter, {{ site.* }}/{{ page.* }} with | default, {% if %}/{% else %}/{% endif %},
{% for x in site.nav|site.data.voyages %} with forloop, {% include %}, {% include_relative %},
markdown conversion of .md bodies. Output: _preview/.
"""
import os, re, sys, json
import yaml
import markdown

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "_preview")

site = yaml.safe_load(open(os.path.join(ROOT, "_config.yml")))
site["data"] = {"voyages": yaml.safe_load(open(os.path.join(ROOT, "_data/voyages.yml")))}

def fm_split(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return yaml.safe_load(text[4:end]), text[end+5:]
    return {}, text

def md(text):
    return markdown.markdown(text, extensions=["extra"])

def lookup(ctx, expr):
    expr = expr.strip()
    if expr == "forloop":
        return ctx.get("__forloop__", {})
    cur = ctx
    for part in expr.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    return cur

def render(tpl, ctx):
    # {% include_relative path %} — markdown-convert first
    def inc_rel(m):
        p = os.path.join(ROOT, m.group(1).strip())
        return render(md(open(p).read()), ctx)
    tpl = re.sub(r"{%\s*include_relative\s+(.+?)\s*%}", inc_rel, tpl)

    # {% include file.html %}
    def inc(m):
        p = os.path.join(ROOT, "_includes", m.group(1).strip())
        return render(open(p).read(), ctx)
    tpl = re.sub(r"{%\s*include\s+([\w./-]+)\s*%}", inc, tpl)

    # {% for var in expr %}...{% endfor %}
    while True:
        m = re.search(r"{%\s*for\s+(\w+)\s+in\s+([\w.]+)\s*%}", tpl)
        if not m:
            break
        start = m.start(); var, expr = m.group(1), m.group(2)
        end = tpl.find("{% endfor %}", start)
        if end == -1:
            raise SystemExit("unterminated for: " + expr)
        body = tpl[m.end():end]
        items = lookup(ctx, expr) or []
        out = []
        for i, it in enumerate(items):
            sub = dict(ctx); sub[var] = it
            sub["__forloop__"] = {"index": i+1, "index0": i, "first": i==0, "last": i==len(items)-1}
            out.append(render(body, sub))
        tpl = tpl[:start] + "".join(out) + tpl[end+len("{% endfor %}"):]
    tpl = tpl.replace("{% endfor %}", "")

    # {% if expr [op value] %}...{% else %}...{% endif %} (depth-aware)
    def cond(m):
        expr = m.group(1).strip()
        mm = re.match(r"([\w.]+)\s*(!=|==)\s*'([^']*)'$", expr)
        if mm:
            val = lookup(ctx, mm.group(1))
            if mm.group(2) == "==":
                ok = str(val) == mm.group(3)
            else:
                ok = str(val) != mm.group(3)
        else:
            ok = bool(lookup(ctx, expr))
        branches = re.split(r"{%\s*else\s*%}", m.group(2))
        return render(branches[0] if ok else (branches[1] if len(branches) > 1 else ""), ctx)

    while True:
        start_m = re.search(r"{%\s*if\s+(.+?)\s*%}", tpl)
        if not start_m:
            break
        # walk forward honouring nesting depth to find the matching endif
        depth = 1
        pos = start_m.end()
        token = re.compile(r"{%\s*(if\s|endif|else)")
        while depth > 0:
            t = token.search(tpl, pos)
            if not t:
                raise SystemExit("unterminated if: " + start_m.group(1))
            tok = t.group(1).strip()
            if tok.startswith("if"):
                depth += 1
            elif tok == "endif":
                depth -= 1
                if depth == 0:
                    end = t.end()
                    break
            pos = t.end()
        block = tpl[start_m.end():t.start()]
        branches = re.split(r"{%\s*else\s*%}", block)
        expr = start_m.group(1).strip()
        mm = re.match(r"([\w.]+)\s*(!=|==)\s*'([^']*)'$", expr)
        if mm:
            val = lookup(ctx, mm.group(1))
            ok = (str(val) == mm.group(3)) if mm.group(2) == "==" else (str(val) != mm.group(3))
        else:
            ok = bool(lookup(ctx, expr))
        chosen = branches[0] if ok else (branches[1] if len(branches) > 1 else "")
        tpl = tpl[:start_m.start()] + render(chosen, ctx) + tpl[end:]

    # {{ expr | filter ... }} or {{ expr }}
    def val(m):
        expr = m.group(1).strip()
        d = re.match(r"([\w.]+)\s*\|\s*default:\s*'([^']*)'$", expr)
        if d:
            v = lookup(ctx, d.group(1))
            return str(v) if v not in (None, "") else d.group(2)
        pipe = expr.split("|")[0].strip()
        if pipe.startswith("'") and pipe.endswith("'"):
            return pipe[1:-1]
        v = lookup(ctx, pipe)
        return "" if v is None else str(v)
    tpl = re.sub(r"{{\s*(.+?)\s*}}", val, tpl)
    return tpl

PAGES = ["index.md", "events.md", "crew.md", "join.md", "join-b.md", "join-c.md", "teamspeak.md", "guides.md"]
os.makedirs(OUT, exist_ok=True)

for name in PAGES:
    raw = open(os.path.join(ROOT, name)).read()
    try:
        page, body = fm_split(raw)
    except yaml.YAMLError as e:
        print(f"{name}: frontmatter unparsable ({str(e).splitlines()[0]}), skipping")
        continue
    ctx = {"site": site, "page": page}
    if name.endswith(".md"):
        body = md(body)
    layout_name = page.get("layout", "default") if isinstance(page, dict) else "default"
    # resolve nested layout chains (article -> frame)
    content = body
    seen = set()
    while True:
        layout_path = os.path.join(ROOT, "_layouts", layout_name + ".html")
        if not os.path.exists(layout_path) or layout_name in seen:
            layout_path = os.path.join(ROOT, "_layouts/frame.html")
        seen.add(layout_name)
        lfm, lbody = fm_split(open(layout_path).read())
        html = render(lbody.replace("{{ content }}", content), dict(ctx, page=dict(page, **(lfm or {}))))
        parent = (lfm or {}).get("layout")
        if not parent:
            break
        layout_name = parent
        content = html
    # unrendered leftovers = bug
    left = re.findall(r"{{|{%", html)
    dest = os.path.join(OUT, name.replace(".md", ".html"))
    open(dest, "w").write(html)
    print(f"{name}: {len(html)} bytes, leftovers={len(left)}")

# copy static assets
import shutil
for d, dst in [("assets/css", "assets/css"), ("assets/js", "assets/js"), ("img", "img")]:
    src = os.path.join(ROOT, d)
    if os.path.isdir(src):
        shutil.copytree(src, os.path.join(OUT, dst), dirs_exist_ok=True)
print("preview ready in _preview/")
