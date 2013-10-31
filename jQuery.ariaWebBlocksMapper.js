;(function ( $, window, document, undefined ) {
    
    var facadeName = 'ariaWebBlocksMapper',
        pluginName = 'ariaMapper',
        headerElements = ['header','hgroup','h1','h2','h3','h4','h5','h6'],
        
        // Default options
        defaults = {
            "roles": {
                "selectors": {
                    "alert": [ 
                        ".message.error", 
                        ".message.danger", 
                        ".message.important", 
                        ".message.required" 
                    ],
                    "search": [ "nav.search" ],
                    "status": [ 
                        ".message.highlight", 
                        ".message.success", 
                        ".message.warning", 
                        ".message.info" 
                    ]
                },
                "filters": {
                    "navigation": function(){ return !this.hasClass('search') }
                },
                "callbacks": {
                },
                "exclusions": []
            }
        };
    
    $.fn[facadeName] = function ( options ) {
        return this[pluginName]($.extend( true, {}, defaults, options));
    }
    

})( jQuery, window, document );