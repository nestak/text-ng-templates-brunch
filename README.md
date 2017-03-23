# Angular Text/NgTemplates Plugin for Brunch

This [Brunch](http://brunch.io) plugin copies a tree of `.html` templates into application's `index.html` file as a bunch of `<script type="text/ng-template" id="FILENAME">` tags.

<!-- TODO installation -->

### Usage

By default, all html files found under your javascripts tree will be copied and inserted as script tags just before closing body tag. Just make sure you follow conventions (see configuration below), and ensure that plugin name is listed as dependency in your `package.json`.

### Limitations

Each of your angular template html file, needs to have a unique name; otherwise generated script tag will be overwritten.

### Configuration

This plugin works "out of the box", if you follow usual conventions:

- your index.html file is located under `app/assets/index.html`
- you use `.html` extension for your angular templates

By default `script` tags will be added just before closing `body` tag.

If you want to change default behaviour, you can use following options in `brunch-config.js`.

```javascript
exports.plugins = {
    textNgTemplates: {
        target: './path/to/target.html' // [[ String ]]
        element: '#valid-selector' // [[ String ]]
    }
};
```

### Example

Consider following file tree.

```
app/
    directives/
        a-directive.html
        a-directive.js
    index.html
```

And example `a-directive.html` file.

```
<ul>
    <li ng-repeat="...">some code...</li>
</ul>
```

When your run brunch, all html files will be copied into `index.html`. The copied file name will be placed as id of the script tag. This will allow you to use this id as a template id for `templateUrl`.

```html
<script type="text/ng-template" id="a-directive">
<ul>
    <li ng-repeat="...">some code...</li>
</ul>
</script>
```

Usage in `a-directive.js` file (example in EcmaScript 6).
```javascript
'use strict'

export default function aDirective () {
    return {
        templateUrl: 'a-directive'
    };
}
```

### License

[MIT](LICENSE)
