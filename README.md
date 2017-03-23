# Angular Text/NgTemplates Plugin for Brunch

This [Brunch](http://brunch.io) plugin copies a tree of `.html` templates into application's `index.html` file as a bunch of `<script type="text/ng-template" id="FILENAME">` tags.

<!-- TODO installation -->

### Usage

Put a `<!-- templateCache -->` comment just before `</body>`. All html files found under your javascripts tree will be copied and inserted between this comment and closing body tag.

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
