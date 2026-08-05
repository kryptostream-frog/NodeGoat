const user = require("../fixtures/users/user.json");

describe("Stats API", () => {
    it("returns JSON with userCount, contributionCount, memoCount", () => {
        cy.request("/api/stats").then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys("userCount", "contributionCount", "memoCount");
            expect(res.body.userCount).to.be.a("number");
        });
    });
});

describe("Stats Page", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.get("input[name='userName']").type(user.userName);
        cy.get("input[name='password']").type(user.password);
        cy.get("button[type='submit'], input[type='submit']").click();
        cy.visit("/stats");
    });

    it("displays the heading", () => {
        cy.get("h1").should("contain", "App Stats");
    });

    it("shows at least a Users row", () => {
        cy.get("table").should("contain", "Users");
    });

    it("links back to the security dashboard", () => {
        cy.get("a[href='/security-dashboard']").should("exist");
    });
});
