import os
import subprocess
import time

print("=== Starting Ultimate Logo Removal ===")

# 1. Comment out toolbar.setExtra('left', ...) in all Viewport.js files
apps = ['documenteditor', 'presentationeditor', 'pdfeditor', 'visioeditor', 'spreadsheeteditor']
for app in apps:
    vp_path = f'/var/www/onlyoffice/documentserver/web-apps/apps/{app}/main/app/controller/Viewport.js'
    if os.path.exists(vp_path):
        with open(vp_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Comment out setExtra left
        content = content.replace(
            "toolbar.setExtra('left', me.header.getPanel('left', config));",
            "/* toolbar.setExtra('left', me.header.getPanel('left', config)); */"
        )
        # Also comment out $title.find('.extra').html(...)
        content = content.replace(
            "$title.find('.extra').html(me.header.getPanel('left', config));",
            "/* $title.find('.extra').html(me.header.getPanel('left', config)); */"
        )

        with open(vp_path, 'w', encoding='utf-8') as f:
            f.write(content)

        subprocess.run(['gzip', '-kf', vp_path], check=True)
        print(f"Disabled setExtra left in {vp_path} and re-gzipped")

# 2. Patch Header.js getPanel('left')
header_js_path = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/lib/view/Header.js'
if os.path.exists(header_js_path):
    with open(header_js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make getPanel('left') return empty and not create logo
    old_code = "if ( role == 'left' && (!config || !config.isDesktopApp)) {"
    new_code = "if ( role == 'left' ) { this.logo = $('<div id=\"header-logo\" style=\"display:none!important;\"></div>'); return $('<div style=\"display:none!important;\"></div>'); } else if ( false ) {"
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open(header_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        subprocess.run(['gzip', '-kf', header_js_path], check=True)
        print("Neutered Header.js getPanel('left') and re-gzipped")
    else:
        print("Warning: old_code not found in Header.js")

# 3. Blank out SVG logo files
blank_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>'
img_dir = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/resources/img/header'
for svg_name in ['header-logo_s.svg', 'dark-logo_s.svg']:
    p = os.path.join(img_dir, svg_name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(blank_svg)
    subprocess.run(['gzip', '-kf', p], check=True)
print("Blanked all header SVG files")

# 4. Generate brand new cache tag
new_tag = f"nologo_ultimate_{int(time.time())}"
cache_conf = '/etc/nginx/includes/ds-cache.conf'
with open(cache_conf, 'w', encoding='utf-8') as f:
    f.write(f'set $cache_tag "{new_tag}";\n')
print(f"Updated Nginx cache_tag to: {new_tag}")

# 5. Reload Nginx
subprocess.run(['nginx', '-s', 'reload'], check=True)
print("=== Ultimate Logo Removal Completed Successfully! ===")
