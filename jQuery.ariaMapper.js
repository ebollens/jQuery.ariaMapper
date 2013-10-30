;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapper',
    
        // Shortcuts for arrays used multiple times in this initializer
        sectionElements = ['article','section','nav','aside','h1','h2','h3','h4','h5','h6','header','footer','main'],
        
        // Shortcuts for methods used multiple times in this definition
        resolveLabeledBy = function(){ $(this).ariaMapperHelper('resolveLabeledBy') },
        prepareRegion = function(){ 
            resolveLabeledBy.call(this)
        }
        
        // Default options
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
                        "complementary": "aside",
                        "navigation": "nav",
                        "region": "section"
                    },
                    "callbacks": {
                        "banner": prepareRegion,
                        "contentinfo": prepareRegion,
                        "main": prepareRegion,
                        "article": prepareRegion,
                        "complementary": prepareRegion,
                        "navigation": prepareRegion,
                        "region": prepareRegion
                    },
                    "filters": {},
                    "exclusions": []
                },
                "selectors": {},
                "filters": {},
                "callbacks": {},
                "exclusions": []
            }
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
    }

    Plugin.prototype.run = function () {
        
        var plugin = this,
            element = this.element,
            options = this.options,
            
            roles = {},
            
            onlyOnceWithRole = ['banner','contentinfo','main'],
            selected,
            
            roleFilters = $.extend({}, options.roles.polyfills.filters, options.roles.filters)
            roleCallbacks = $.extend({}, options.roles.polyfills.callbacks, options.roles.callbacks);
    
        jQuery.each(options.roles.selectors, function(k, v){
            roles[k] = jQuery.isArray(v) ? v : [v] 
        });
        
        if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false){
            
            jQuery.each(options.roles.polyfills.selectors, function(k,v){ 
                if(options.roles.polyfills.exclusions.indexOf(k) < 0){
                    if(!roles[k]){
                        roles[k] = jQuery.isArray(v) ? v : [v]
                    }else{
                        jQuery.merge(roles[k], jQuery.isArray(v) ? v : [v]) 
                    }
                }
            });
            
        }
        
        jQuery.each(roles, function(name, selectors){
            
            if(options.roles.exclusions.indexOf(name) < 0){
                
                selected = $(element).find(selectors.join(', ')).filter(function(){ return $(this).attr('aria-role') === undefined })
                
                if(roleFilters[name])
                    selected = selected.filter(roleFilters[name])
                
                if(onlyOnceWithRole.indexOf(name) >= 0 && (selected.length + $(element).find('[aria-role="'+name+'"]').length > 1))
                    return;
                
                selected.attr('aria-role',name);
                
                if(roleCallbacks[name])
                    $('[aria-role="'+name+'"]').each(function(){
                        var ele = $(this);
                        ele.super = function(){
                            if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false)
                                if(options.roles.polyfills.callbacks[name] && options.roles.polyfills.exclusions.indexOf(name) < 0)
                                    options.roles.polyfills.callbacks[name].call(ele)
                        }
                        ele.helper = $(ele).ariaMapperHelper;
                        roleCallbacks[name].call(ele)
                    })
            }
        })
        
    };
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            (new Plugin(this, options)).run();
        });
    }
    

})( jQuery, window, document );