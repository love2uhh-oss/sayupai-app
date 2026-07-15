#!/usr/bin/env python3
"""Create export options plist for Xcode (App Store distribution)
Compatible with both Xcode 16.x (method: app-store) and Xcode 26.x (method: app-store-connect)
"""
import plistlib
import sys
import subprocess

def get_xcode_version():
    """Get the major version of Xcode"""
    try:
        result = subprocess.run(
            ['xcodebuild', '-version'],
            capture_output=True, text=True, timeout=10
        )
        # Output: "Xcode 16.4\nBuild version ..."
        first_line = result.stdout.strip().split('\n')[0]
        # Extract major version number
        version_str = first_line.replace('Xcode ', '').strip()
        major = int(version_str.split('.')[0])
        print(f'Detected Xcode version: {version_str} (major: {major})')
        return major
    except Exception as e:
        print(f'Could not detect Xcode version: {e}, defaulting to Xcode 26 behavior')
        return 26

output_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/export_options.plist'

xcode_major = get_xcode_version()

# Xcode 26+ uses 'app-store-connect', Xcode 16 and earlier uses 'app-store'
if xcode_major >= 26:
    method_value = 'app-store-connect'
else:
    method_value = 'app-store'

print(f'Using method: {method_value}')

d = {
    'method': method_value,
    'destination': 'export',
    'teamID': '6Q7S9N7MQ7',
    'signingStyle': 'manual',
    'signingCertificate': 'Apple Distribution',
    'provisioningProfiles': {
        'com.speakfitai.app': 'SpeakFit AI ios_app_store 1783551989'
    },
    'uploadBitcode': False,
    'uploadSymbols': True
}

with open(output_path, 'wb') as f:
    plistlib.dump(d, f)
print(f'Export options plist created at {output_path}')
print(f'Contents: method={method_value}, teamID=6Q7S9N7MQ7, signingStyle=manual')
