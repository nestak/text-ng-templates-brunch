'use strict';

var fs = require('fs');
var glob = require('glob');
var cheerio = require('cheerio');

function Templates (config) {
    var defaults = {
        insertTo: './public/index.html',
        extension: 'html'
    };
    var params = Object.assign(defaults, config.plugins.textNgTemplates);

    this.insertTo = params.insertTo;
    this.extension = params.extension;
    this.TEMPLATE_CACHE = {};
    this.templatesToUpdate = [];
}

Templates.prototype.brunchPlugin = true;
Templates.prototype.extension = function () {
    return this.extension;
};

Templates.prototype.compile = function (file) {
    var id = filename(file.path);

    if (id !== this.targetId) {
        this.TEMPLATE_CACHE[id] = file.data;
        this.templatesToUpdate.push(id);
    }
};

Templates.prototype.onCompile = function (files, assets) {
    var cache = this.TEMPLATE_CACHE;
    var target = this.insertTo;
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
            });
            templatesToUpdate.length = 0;
        });
    }
};

function filename (path) {
    return path.split('/').pop().split('.').shift();
}

module.exports = Templates;
