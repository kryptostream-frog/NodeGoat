"use strict";

function StatsHandler(db) {
    this.getStats = (req, res, next) => {
        Promise.all([
            new Promise((resolve, reject) => {
                db.collection("users").count({}, (err, n) => err ? reject(err) : resolve(n));
            }),
            new Promise((resolve, reject) => {
                db.collection("contributions").count({}, (err, n) => err ? reject(err) : resolve(n));
            }),
            new Promise((resolve, reject) => {
                db.collection("memos").count({}, (err, n) => err ? reject(err) : resolve(n));
            }),
        ]).then(([userCount, contributionCount, memoCount]) => {
            return res.json({ userCount, contributionCount, memoCount });
        }).catch(next);
    };
}

module.exports = StatsHandler;
