import os
import glob
import subprocess
import time

print("=== Starting Complete Logo Annihilation ===")

# 1. Remove <div class="extra left"></div> from ALL templates
for root, dirs, files in os.walk('/var/www/onlyoffice/documentserver/web-apps/apps'):
    for file in files:
        if file.endswith('.template'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'class="extra left"' in content:
                content = content.replace('<div class="extra left"></div>', '<div class="extra left" style="display:none!important;width:0px!important;height:0px!important;overflow:hidden!important;"></div>')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Patched template: {path}")

# 2. Patch Mixtbar.js
mixtbar_path = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/lib/component/Mixtbar.js'
if os.path.exists(mixtbar_path):
    with open(mixtbar_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(
        "this.$layout.find('.extra.left').html(el);",
        "this.$layout.find('.extra.left').empty().hide();"
    )
    with open(mixtbar_path, 'w', encoding='utf-8') as f:
        f.write(content)
    subprocess.run(['gzip', '-kf', mixtbar_path], check=True)
    print("Patched Mixtbar.js and re-gzipped")

# 3. Patch Header.js
header_js = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/lib/view/Header.js'
if os.path.exists(header_js):
    with open(header_js, 'r', encoding='utf-8') as f:
        content = f.read()
    # Make getPanel('left') return empty
    content = content.replace(
        "if ( role == 'left' && (!config || !config.isDesktopApp)) {",
        "if ( role == 'left' ) { this.logo = $('<div id=\"header-logo\" style=\"display:none!important;\"></div>'); return $('<div style=\"display:none!important;\"></div>'); } else if ( false ) {"
    )
    with open(header_js, 'w', encoding='utf-8') as f:
        f.write(content)
    subprocess.run(['gzip', '-kf', header_js], check=True)
    print("Patched Header.js and re-gzipped")

# 4. Patch all app.css to remove header-logo_s.svg background-image and hide .extra.left
for root, dirs, files in os.walk('/var/www/onlyoffice/documentserver/web-apps/apps'):
    for file in files:
        if file == 'app.css':
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            content = content.replace("url('../../../../common/main/resources/img/header/header-logo_s.svg')", "none")
            content = content.replace("url('../../../../common/main/resources/img/header/dark-logo_s.svg')", "none")
            content = content.replace(".extra #header-logo i{cursor:pointer;width:86px;height:20px;", ".extra #header-logo i{display:none!important;width:0!important;height:0!important;")
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            subprocess.run(['gzip', '-kf', path], check=True)
            print(f"Patched app.css: {path}")

# 5. Overwrite SVG files with empty SVG
blank_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>'
img_dir = '/var/www/onlyoffice/documentserver/web-apps/apps/common/main/resources/img/header'
for svg_name in ['header-logo_s.svg', 'dark-logo_s.svg']:
    p = os.path.join(img_dir, svg_name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(blank_svg)
    subprocess.run(['gzip', '-kf', p], check=True)
print("Blanked SVG logo files")

# 6. Update cache tag
new_tag = f"nologo_clean_{int(time.time())}"
cache_conf = '/etc/nginx/includes/ds-cache.conf'
with open(cache_conf, 'w', encoding='utf-8') as f:
    f.write(f'set $cache_tag "{new_tag}";\n')
print(f"Updated Nginx cache_tag to: {new_tag}")

# 7. Reload Nginx
subprocess.run(['nginx', '-s', 'reload'], check=True)
print("=== Successfully Finished! ===")
