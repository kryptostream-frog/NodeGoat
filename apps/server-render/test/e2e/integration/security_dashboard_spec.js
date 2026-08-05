const user = require("../fixtures/users/user.json");

describe("Security Dashboard", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.get("input[name='userName']").type(user.userName);
        cy.get("input[name='password']").type(user.password);
        cy.get("button[type='submit'], input[type='submit']").click();
        cy.visit("/security-dashboard");
    });

    it("displays the heading", () => {
        cy.get("h1").should("contain", "Security Dashboard");
    });

    it("lists all 10 OWASP vulnerabilities", () => {
        cy.get("table tbody tr").should("have.length", 10);
    });

    it("each row contains a working link to a training module", () => {
        cy.get("table tbody tr").each(($row) => {
            cy.wrap($row).find("a").should("have.attr", "href").and("not.be.empty");
        });
    });

    it("has a back link to the dashboard", () => {
        cy.get("a[href='/dashboard']").should("exist");
    });
});
