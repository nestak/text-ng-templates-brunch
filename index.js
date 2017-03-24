'use strict';

var fs = require('fs');
var glob = require('glob');
var cheerio = require('cheerio');

function Templates (config) {
    var defaults = {
        target: './app/assets/index.html'
    };
    this.config = config.plugins.textNgTemplates || defaults;
    this.TEMPLATE_CACHE = {};
    this.templatesToUpdate = [];
}

Templates.prototype.brunchPlugin = true;
Templates.prototype.type = 'javascript';
Templates.prototype.extension = 'html';

Templates.prototype.preCompile = function () {
    var target = this.config.target;

    glob('app/**/*.html', function (err, paths) {
        if (err) { throw err; }

        fs.readFile(target, 'utf-8', function (err, data) {
            if (err) { throw err; }

            var tags = [];
            var indexId = target.split('/').pop().split('.').shift();
            paths.forEach(function (path) {
                var id = path.split('/').pop().split('.').shift();
                if (id !== indexId) {
                    tags.push(`<script type="text/ng-template" id="${id}"></script>\r\n`);
                }
            });

            var $ = cheerio.load(data);
            var element = $('body');
            element.find('script[type="text/ng-template"]').remove();
            element.append(tags.join(''));

            fs.writeFile(target, $.html(), 'utf-8', function (err) {
                if (err) { throw err; }
            });
        });
    });
};

Templates.prototype.compile = function (file) {
    var id = file.path.split('/').pop().split('.').shift();
    this.TEMPLATE_CACHE[ id ] = file.data;
    this.templatesToUpdate.push(id);
};

Templates.prototype.onCompile = function () {
    var cache = this.TEMPLATE_CACHE;
    var target = this.config.target;
    var templatesToUpdate = this.templatesToUpdate;

    if (templatesToUpdate.length > 0) {
        fs.readFile(target, 'utf-8', function (err, data) {
            if (err) { throw err; }

            var $ = cheerio.load(data);
            templatesToUpdate.forEach(function (id) {
                var target = $('#' + id);
                if (target.length > 0) {
                    target.text(cache[id]);
                }
                else {
                    var template = $(`<script type="text/ng-template" id="${id}">${cache[id]}</script>`);
                    $('body').append(template);
                }
            });

            fs.writeFile(target, $.html(), function (err) {
                if (err) { throw err; }
                templatesToUpdate.length = 0;
            });
        });
    }
};

module.exports = Templates;
