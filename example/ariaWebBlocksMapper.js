;(function ( $, window, document, undefined ) {
    
    var facadeName = 'ariaWebBlocksMapper',
        pluginName = 'ariaMapper',
        
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
    
    $.fn[facadeName] = function ( options ) {
        return this[pluginName]($.extend( true, {}, defaults, options));
    }
    

})( jQuery, window, document );