#!/usr/bin/env python3
"""Create export options plist for Xcode (App Store distribution)
Xcode 26+ does NOT support 'method' key - it has been removed.
Xcode 16 and earlier use 'method: app-store'.
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
        first_line = result.stdout.strip().split('\n')[0]
        version_str = first_line.replace('Xcode ', '').strip()
        major = int(version_str.split('.')[0])
        print(f'Detected Xcode version: {version_str} (major: {major})')
        return major
    except Exception as e:
        print(f'Could not detect Xcode version: {e}, defaulting to Xcode 26 behavior')
        return 26

output_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/export_options.plist'

xcode_major = get_xcode_version()

# Base options without 'method' key (required for Xcode 26+)
d = {
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

# Xcode 16 and earlier require 'method' key
if xcode_major < 26:
    d['method'] = 'app-store'
    print(f'Xcode {xcode_major}: Adding method=app-store')
else:
    print(f'Xcode {xcode_major}: No method key (Xcode 26+ removed this key)')

with open(output_path, 'wb') as f:
    plistlib.dump(d, f)
print(f'Export options plist created at {output_path}')
