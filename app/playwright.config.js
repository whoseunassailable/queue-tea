"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: 'e2e',
    testMatch: '*.e2e.ts',
    timeout: 60000,
    workers: 1,
    reporter: 'line',
});
