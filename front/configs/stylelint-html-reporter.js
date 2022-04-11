const stylelintReporter = require('stylelint-html-reporter');
const reporter = stylelintReporter({
    filename: './report.html',
});

/**
 * @type {import('stylelint').Formatter}
 */
module.exports = reporter;
