#!/usr/bin/env node

/*
  Copyright (c) jQuery Foundation, Inc. and Contributors, All Rights Reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var fs = require('fs');

function findCanonicalVersion() {
    var matcher, lines, version;

    matcher = /exports\.version\s+=\s+\'([0-9\.\-a-zA-Z]+)\'/;
    lines = fs.readFileSync(require.resolve('../'), 'utf-8').split('\n');
    lines.forEach(function (line) {
        if (matcher.test(line)) {
            version = matcher.exec(line)[1];
        }
    });

    return version;
}

function ensureVersion(manifestFile, expectedVersion) {
    var matcher, lines, version;

    console.log('Checking', manifestFile, '...');
    matcher = /"version"\s*\:\s*"([0-9\.\-a-zA-Z]+)"/;
    lines = fs.readFileSync(manifestFile, 'utf-8').split('\n');
    lines.forEach(function (line) {
        if (matcher.test(line)) {
            version = matcher.exec(line)[1];
        }
    });
    if (expectedVersion !== version) {
        console.log('ERROR: Wrong version for', manifestFile);
        console.log('Expected:', expectedVersion);
        console.log('  Actual:', version);
        process.exit(1);
    }
}

function checkVersion() {
    var version;

    console.log('Getting the canonical library version...');
    version = findCanonicalVersion();
    if (typeof version !== 'string') {
        console.log('ERROR: Can not get version number!', typeof version);
        process.exit(1);
    }
    console.log('Library version is', version);

    ensureVersion('package.json', version);
    ensureVersion('bower.json', version);
}


checkVersion();
