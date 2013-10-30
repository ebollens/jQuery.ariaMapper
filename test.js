(function($){
    
    MockLoader = function(id, options){
        
        var mock = this;
        
        mock.element = $('#'+id);
        mock.options = options ? options : {};
        
        this.test = function(filename, callback){
            $.get('test/mock/'+filename+'.html', function(data){
                mock.element.empty().html(data);
                callback.call(mock.element);
                mock.element.empty();
                start();
            })
        }
        
        this.run = function(options, element){
            return (element || mock.get()).ariaMapper(options || {});
        }
        
    }
    
    var _ = new MockLoader('test-region');

    test( "Callable module", function() {
        ok( typeof $.fn.ariaMapper == 'function' , "Passed!" );
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Landmark Mapping Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    $.each({'.-banner':'banner', '.-main':'main', '.-contentinfo':'contentinfo'}, function( selector, role ){
        
        asyncTest( "Polyfill `"+role+"` landmark mapping for selector `"+selector+"`", function() {
            _.test('basicSections', function(){
                this.ariaMapper()
                ok( this.find(selector+'[aria-role="'+role+'"]').length == 1, "Mapped to expected element");
                ok( this.find(':not('+selector+')[aria-role="'+role+'"]').length == 0, "Not mapped to unexpected elements");
            })
        });
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Document Structure Mapping Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    $.each({'article':'article','nav':'navigation','section':'region','aside':'complementary'}, function( selector, role ){ 

        asyncTest( "Polyfill `"+role+"` document structure mapping for selector `"+selector+"`", function() {
            _.test('basicSections', function(){
                this.ariaMapper()
                ok( this.find(selector+'[aria-role="'+role+'"]').length == this.find(selector).length, "Mapped to expected elements");
                ok( this.find(':not('+selector+')[aria-role="'+role+'"]').length == 0, "Not mapped to unexpected elements");
            })
        });
        
    });

})(jQuery);