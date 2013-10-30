;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapperHelper',
        headerElements = ['header','hgroup','h1','h2','h3','h4','h5','h6'];

    function Plugin( ) {
        this._name = pluginName;
    }
    
    Plugin.prototype.resolveLabeledBy = function(labelSelectors){
        
        var ele = this;
        
        if(!labelSelectors)
            labelSelectors = headerElements;
        
        if(!ele.attr('aria-labeledby')){
            var children = $(labelSelectors).filter(function(){ return ele.find(this.toString()).length > 0 }).get()
            if(children.length > 0){
                var child = ele.find(children[0]).first()
                if(child.attr('id') === undefined)
                    child.attr('id', "aria-"+Math.random().toString(36).substring(2));
                ele.attr('aria-labeledby',child.attr('id'))
            }
        }
    }
    
    $.fn[pluginName] = function ( operation ) {
        var args = Array.prototype.slice.call(arguments).slice(1);
        return this.each(function () {
            (new Plugin)[operation].apply($(this), args);
        });
    }
    

})( jQuery, window, document );