const should = require('should');
const hbs = require('../../../core/frontend/services/themes/engine');
const configUtils = require('../../utils/configUtils');
const path = require('path');

const runHelper = data => helpers.navigation.call({}, data);
// Stuff we are testing
const helpers = require('../../../core/frontend/helpers');

describe('{{content}} helper', function () {
    before(function (done) {
        hbs.express4({partialsDir: [configUtils.config.get('paths').helperTemplates]});

        hbs.cachePartials(function () {
            done();
        });
    });

    it('renders empty string when null', function () {
        const html = null;
        const rendered = helpers.content.call({html: html});

        should.exist(rendered);
        rendered.string.should.equal('');
    });

    it('can render content', function () {
        const html = 'Hello World';
        const rendered = helpers.content.call({html: html});

        should.exist(rendered);
        rendered.string.should.equal(html);
    });

    it('can truncate html by word', function () {
        const html = '<p>Hello <strong>World! It\'s me!</strong></p>';

        const rendered = (
            helpers.content
                .call(
                    {html: html},
                    {hash: {words: 2}}
                )
        );

        should.exist(rendered);
        rendered.string.should.equal('<p>Hello <strong>World!</strong></p>');
    });

    it('can truncate html to 0 words', function () {
        const html = '<p>Hello <strong>World! It\'s me!</strong></p>';

        const rendered = (
            helpers.content
                .call(
                    {html: html},
                    {hash: {words: '0'}}
                )
        );

        should.exist(rendered);
        rendered.string.should.equal('');
    });

    it('can truncate html by character', function () {
        const html = '<p>Hello <strong>World! It\'s me!</strong></p>';

        const rendered = (
            helpers.content
                .call(
                    {html: html},
                    {hash: {characters: 8}}
                )
        );

        should.exist(rendered);
        rendered.string.should.equal('<p>Hello <strong>Wo</strong></p>');
    });
});

describe('{{content}} helper with no access', function () {
    let optionsData;
    before(function (done) {
        hbs.express4({partialsDir: [configUtils.config.get('paths').helperTemplates]});

        hbs.cachePartials(function () {
            done();
        });
    });

    beforeEach(function () {
        optionsData = {
            data: {
                site: {
                    accent_color: '#abcdef'
                }
            }
        };
    });

    it('can render default template', function () {
        const html = 'Hello World';
        const rendered = helpers.content.call({html: html, access: false}, optionsData);
        rendered.string.should.containEql('gh-post-upgrade-cta');
        rendered.string.should.containEql('gh-post-upgrade-cta-content');
        rendered.string.should.containEql('"background-color: #abcdef"');

        should.exist(rendered);
    });
});

describe('{{content}} helper with no access', function () {
    let optionsData;
    before(function (done) {
        hbs.express4({partialsDir: [path.resolve(__dirname, './test_tpl')]});

        hbs.cachePartials(function () {
            done();
        });
    });

    it('can render custom template', function () {
        const html = 'Hello World';
        const rendered = helpers.content.call({html: html, access: false}, optionsData);
        rendered.string.should.not.containEql('gh-post-upgrade-cta');
        rendered.string.should.containEql('custom-post-upgrade-cta');
        rendered.string.should.containEql('custom-post-upgrade-cta-content');

        should.exist(rendered);
    });
});
