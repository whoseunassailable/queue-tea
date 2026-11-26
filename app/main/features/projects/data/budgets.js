"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBudget = exports.budgetOf = void 0;
// Time I have, per realm. Kept here rather than in the window because every edit
// hands back a fresh board, which must rank by it too. It's held in memory only
// and resets on quit, like the terminal's per-session value.
var budgets = new Map();
var budgetOf = function (key) { var _a; return (_a = budgets.get(key)) !== null && _a !== void 0 ? _a : null; };
exports.budgetOf = budgetOf;
var setBudget = function (key, budget) {
    if (budget === null)
        budgets.delete(key);
    else
        budgets.set(key, budget);
};
exports.setBudget = setBudget;
