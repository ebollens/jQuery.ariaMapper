# jQuery.ariaMapper

jQuery.ariaMapper is a module that applies ARIA attributes based on semantics. It includes some conservative default mappings for HTML 5 elements and supports the application of additional custom mappings, such as where semantics can be ascertained from CSS selectors (such as the classes defined for particular purposes within a framework).

## Foreword

### Status

This implementation is a **work-in-progress prototype**, so use at your own risk. Additionally, this implementation is not yet complete, currently with some performance issues, partial test coverage and support for only the `role` and `aria-labeledby` attributes. Issues and pull requests are greatly appreciated.

### License

jQuery.ariaMappper is **open-source software** licensed under the BSD 3-clause license. The full text of the license may be found in the `LICENSE` file.

### Credits

This library is written and maintained by Eric Bollens.

This library would not be possible without [jQuery](http://jquery.com). Additionally, tests and compilation are made possible thanks to [QUnit](https://qunitjs.com), [Grunt](http://gruntjs.com) and [UglifyJS](http://lisperator.net/uglifyjs/).

## Setup

In all cases, you must run:

```
npm install
```

To run the tests, additionally run:

```
./node_modules/bower/bin/bower install
```

To compile the mapper, call grunt:

```
./node_modules/grunt-cli/bin/grunt
```

## Usage

### Simple Usage

To use the mapper, use must include:

* jQuery 1.8.0 or above
* jQuery.ariaMapper

The simplest way to run the mapping engine is to place the following at the bottom of your page:

```html
<script type="text/javascript">
$('body').ariaMapper();
</script>
```

If the DOM changes, you may invoke the mapping engine again simply by calling `$('body').ariaMapper()` again. As long as it is called on the same root node with the same options (in this case, none specified), it is idempotent.

### Custom Mappings

The mapper supports custom options passed as:

```js
$(ele).ariaMapper(options);
```

An example of a custom mapping:

```js
var custom = {
    "roles": {
        "selectors": {
            "alert": [
                ".message.error",
                ".message.danger",
                ".message.important"
            ],
            "search": [
                "nav.search"
            ],
            "status": [
                ".message.success",
                ".message.warning",
                ".message.info"
            ]
        }
    },
    "labeledby": {
        "selectors": {
            "form.form div.control label input": function(){
                var label = this.closest('div.control').children('label').first();
                if(label.find('input').length == 0)
                    this.ariaMapperHelper('setLabeledBy', label)
            }
        }
    }
};
```

For a more complex example which defines a wrapper of its own default settings, in addition to the mapper's base defaults, see `example/ariaWebBlocksMapper.js`.

### Polyfill

Several default polyfill mappings will be made between HTML 5 semantics and ARIA roles.

The mapper may be run with no polyfills as:

```js
$('body').ariaMapper({'polyfill':false});
```

The mapper may be run without polyfill roles mappings but still other polyfill mappings such as:

```js
$('body').ariaMapper({'roles':{'polyfill':false}});
```

The mapper may be run without polyfill labeledby mappings but still other polyfill mappings such as:

```js
$('body').ariaMapper({'labeledby':{'polyfill':false}});
```

### Default Options

The default options are defined as:

```js
var sectionElements = [
        'article',
        'section',
        'nav',
        'aside',
        'h1',
        'h2','h3','h4','h5','h6','header','footer','main'],
    regionRoles = [
        'alert',
        'alertdialog',
        'application',
        'article',
        'banner',
        'complementary',
        'contentinfo',
        'directory',
        'form',
        'grid',
        'list',
        'log',
        'main',
        'navigation',
        'region',
        'search',
        'status',
        'tabpanel',
        'tablist',
        'timer',
        'treegrid'
    ],
    defaults = {
        "polyfill": true,
        "roles": {
            "polyfill":null,
            "polyfills": {
                "selectors": {
                    "banner": "header:not("+sectionElements.join(' header):not(')+" header)",
                    "contentinfo": "footer:not("+sectionElements.join(' footer):not(')+" footer)",
                    "main": "main",
                    "article": "article",
                    "complementary": "aside:not(main aside)",
                    "navigation": "nav",
                    "region": "section"
                },
                "callbacks": {
                },
                "filters": {},
                "exclusions": []
            },
            "selectors": {},
            "filters": {},
            "callbacks": {},
            "exclusions": []
        },
        "labeledby": {
            "roles": {
                /* filled in later */
            },
            "selectors": {}
        }
    };

/* designate all region roles as true to have labeledby resolved */
$(regionRoles).each(function(){
    defaults.labeledby.roles[this.toString()] = true;
})
```
