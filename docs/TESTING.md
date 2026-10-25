# Testing, reporting and handover guide

## What a test result means

A **test** checks a specific claim about the code or data. A **PASS** means the tested expectation held in that environment, **not** that the whole website or a country's tax rules are perfect. A **FAIL** means the expectation did not hold and needs investigation. **BLOCKED / NOT RUN** is a separate outcome, never a pass. A **fixture** is artificial data built for tests: it does not establish an official national statistic.

### Where to find each result

1. The durable [TEST_LOG.md](TEST_LOG.md) documents milestones, attempts, what failed, changes made, evidence links, and outstanding work.
2. Every PR validation and public deployment runs `npm run test:report`. The run creates `test-results/test-report.md` containing **one row for each executed JavaScript and Python test** with its test name as the explanation of what it checks, PASS/FAIL and the supporting suite. Complete console output and errors are saved alongside it.
3. GitHub Actions uploads a **test-explanations** artifact and copies the report into the **workflow run summary**, including when a test fails. A generated test artifact has finite retention: record the important findings and changes permanently in `docs/TEST_LOG.md`.
4. The CI workflow also independently fetches Eurostat and builds the site. A passing unit-test report does **not** imply those network/data/build stages passed. The change log must note their outcome from the Actions run.
5. For tests run outside CI (browser smoke tests, manual tax examples, independent legal/source checks), append the command/steps, evidence, PASS/FAIL/BLOCKED, interpretation, adjustment and next action to `docs/TEST_LOG.md`. There is no automated capture of unreported manual actions.

### Reproducing the automated tests

```sh
npm test                 # JavaScript test suite only
npm run test:report      # JavaScript + Python, individual-result Markdown and raw logs
npm run context:refresh  # fresh Eurostat economic series (requires network)
npm run data:refresh     # fresh Eurostat expenditure data (requires network)
npm run build            # compile static site
```

A test report includes the commit SHA and Actions run identifier when available. Its test titles come directly from the test files, not from an AI-written assertion that an unrun test succeeded. Prefer descriptive test names of the form `Test feature X returns Y under Z`; add or update a test when fixing any discovered defect.

### Mandatory change record template

```md
### YYYY-MM-DD — Short change title (PR # / commit / workflow run)
- **Goal:** In plain language.
- **Affected:** Country/year/dataset/component, or "all countries".
- **Attempt 1:** Command or exact user steps; expected; actual PASS/FAIL/BLOCKED; what that result proves/doesn't prove.
- **Problem:** Exact error or linked diagnostics; suspected cause.
- **Adjustment:** What was changed and why.
- **Retest:** Command; result; exact run or screenshot, if available.
- **Limitations:** Not tested, uncertain inputs, potential breakages.
- **Next:** One concrete follow-up.
```

Never overwrite failure history with only the successful retest. Keep the date, links, negative results, and open problems discoverable.

### Reviewer / contributor checklist

- [ ] Did the change add a `docs/TEST_LOG.md` entry describing the change and the **actual** test outcomes (or NOT RUN)?
- [ ] Are all source dates, units, denominators, countries and languages explicit?
- [ ] Are failures and their fixes recorded instead of hidden?
- [ ] Does each newly introduced technical label have a nearby plain-language explanation and a glossary entry?
- [ ] Are country-specific facts shown only with the selected country?
- [ ] Does the PR link to the individual test results and clarify what wasn't verified?
