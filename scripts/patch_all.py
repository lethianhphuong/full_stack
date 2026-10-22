import os
import subprocess
import time

print("=== Starting Full OnlyOffice Logo Patch ===")

# 1. Patch Header.js
header_js_path = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/lib/view/Header.js'
if os.path.exists(header_js_path):
    with open(header_js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Hide templateLeftBox
    content = content.replace(
        """var templateLeftBox = '<section class="logo">' +
                                '<div id="header-logo"><i></i></div>' +
                            '</section>';""",
        """var templateLeftBox = '<section class="logo" style="display:none!important;width:0!important;height:0!important;overflow:hidden!important;"><div id="header-logo" style="display:none!important;width:0!important;"><i></i></div></section>';"""
    )

    # Force hide in role == 'left'
    content = content.replace(
        "this.logo = $html.find('#header-logo');",
        "this.logo = $html.find('#header-logo'); $html.hide(); this.logo.hide();"
    )

    with open(header_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    subprocess.run(['gzip', '-kf', header_js_path], check=True)
    print("Patched Header.js and re-gzipped")

# 2. Patch ToolbarView.template
tv_path = '/var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/app/template/ToolbarView.template'
if os.path.exists(tv_path):
    with open(tv_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<div class="extra left"></div>', '<div class="extra left" style="display:none!important;width:0!important;height:0!important;overflow:hidden!important;"></div>')
    with open(tv_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched ToolbarView.template")

# 3. Comprehensive CSS rule
CSS_RULE = """
.extra, .extra.left, .extra #header-logo, .extra #header-logo i, #header-logo, section.logo, .logo, .box-logo, .box-tabs .extra.left, .box-tabs .extra {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  max-width: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  overflow: hidden !important;
  pointer-events: none !important;
  border: none !important;
  background: none !important;
}
"""

JS_SNIPPET = """<script>
(function() {
  function hideAllLogos() {
    var selectors = ['#header-logo', '.logo', 'section.logo', '.extra.left', '.box-tabs .extra.left', '.extra #header-logo', '.box-logo'];
    for (var s = 0; s < selectors.length; s++) {
      var els = document.querySelectorAll(selectors[s]);
      for (var i = 0; i < els.length; i++) {
        els[i].style.setProperty('display', 'none', 'important');
        els[i].style.setProperty('width', '0px', 'important');
        els[i].style.setProperty('height', '0px', 'important');
        els[i].style.setProperty('visibility', 'hidden', 'important');
        els[i].style.setProperty('overflow', 'hidden', 'important');
        els[i].style.setProperty('margin', '0px', 'important');
        els[i].style.setProperty('padding', '0px', 'important');
      }
    }
  }
  setInterval(hideAllLogos, 30);
  window.addEventListener('DOMContentLoaded', hideAllLogos);
  window.addEventListener('load', hideAllLogos);
})();
</script>"""

# 4. Patch all apps index.html and app.css
apps = ['pdfeditor', 'documenteditor', 'presentationeditor', 'spreadsheeteditor', 'visioeditor', 'common']
for app in apps:
    paths_to_check = [
        f'/var/www/onlyoffice/documentserver/web-apps/apps/{app}/main/index.html',
        f'/var/www/onlyoffice/documentserver/web-apps/apps/{app}/index.html'
    ]
    for html_path in paths_to_check:
        if os.path.exists(html_path):
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'hideAllLogos' not in content:
                content = content.replace('</body>', f'{JS_SNIPPET}</body>')
            style_tag = f'<style>{CSS_RULE}</style>'
            if '.extra.left' not in content:
                content = content.replace('</head>', f'{style_tag}</head>')
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content)
            subprocess.run(['gzip', '-kf', html_path], check=True)
            print(f"Patched HTML: {html_path}")

    css_path = f'/var/www/onlyoffice/documentserver/web-apps/apps/{app}/main/resources/css/app.css'
    if os.path.exists(css_path):
        with open(css_path, 'a', encoding='utf-8') as f:
            f.write(CSS_RULE)
        subprocess.run(['gzip', '-kf', css_path], check=True)
        print(f"Patched CSS: {css_path}")

# 5. Overwrite SVG files with empty SVG
blank_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>'
img_dir = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/resources/img/header'
for svg_name in ['header-logo_s.svg', 'dark-logo_s.svg']:
    p = os.path.join(img_dir, svg_name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(blank_svg)
    subprocess.run(['gzip', '-kf', p], check=True)
print("Replaced all header SVG files")

# 6. Update Nginx cache tag
new_tag = f"nologo_final_{int(time.time())}"
cache_conf = '/etc/nginx/includes/ds-cache.conf'
with open(cache_conf, 'w', encoding='utf-8') as f:
    f.write(f'set $cache_tag "{new_tag}";\n')
print(f"Updated Nginx cache_tag to: {new_tag}")

# 7. Reload Nginx
subprocess.run(['nginx', '-s', 'reload'], check=True)
print("=== Successfully Patched Everything and Reloaded Nginx! ===")
