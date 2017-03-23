'use strict';

var fs = require('fs');
var glob = require('glob');
var cheerio = require('cheerio');

function Templates (config) {
    var defaultTarget = './app/assets/index.html';
    var params = config.plugins.textNgTemplates || {};
    this.target = params.target || defaultTarget;
    this.TEMPLATE_CACHE = {};
    this.templatesToUpdate = [];
}

Templates.prototype.brunchPlugin = true;
Templates.prototype.type = 'javascript';
Templates.prototype.extension = 'html';

Templates.prototype.preCompile = function () {
    var target = this.target;

    glob('app/**/*.html', function (err, paths) {
        if (err) { throw err; }

        var pattern = /<!-- templateCache -->(\s|.)*(?=<\/body>)/g;

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

            var dataStr = `<!-- templateCache -->\r\n${tags.join('')}`;

            fs.writeFile(target, data.replace(pattern, dataStr), 'utf-8', function (err) {
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
    var target = this.target;
    var templatesToUpdate = this.templatesToUpdate;

    if (templatesToUpdate.length > 0) {
        fs.readFile(target, 'utf-8', function (err, data) {
            if (err) { throw err; }

            var $ = cheerio.load(data);
            templatesToUpdate.forEach(function (id) {
                $('#' + id).text(cache[id]);
            });

            fs.writeFile(target, $.html(), function (err) {
                if (err) { throw err; }
                templatesToUpdate.length = 0;
            });
        });
    }
};

module.exports = Templates;