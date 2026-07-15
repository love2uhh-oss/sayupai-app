#!/usr/bin/env python3
"""Create export options plist for Xcode (app-store method)"""
import plistlib
import sys

output_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/export_options.plist'

d = {
    'method': 'app-store',
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
