(function($){
    
    MockLoader = function(id, options){
        
        var mock = this;
        var scripts = document.getElementsByTagName('script');
        var dir = scripts[scripts.length-1].src.split('?')[0].split('/').slice(0, -1).join('/')+'/';
        
        mock.element = $('#'+id);
        mock.options = options ? options : {};
        
        this.test = function(filename, callback){
            $.get(dir+'mock/'+filename+'.html', function(data){
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
        ok( typeof $.fn.ariaMapper == 'function' , "Module ariaMapper is available on jQuery.fn" );
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Landmark Mapping Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Roles polyfill landmark role mappings", function() {
        
        $.each({'.-banner':'banner', '.-main':'main', '.-contentinfo':'contentinfo'}, function( selector, role ){
            _.test('sectionsBasic', function(){
                this.ariaMapper()
                ok( this.find(selector+'[role="'+role+'"]').length == 1, "Mapped `"+role+"` document structure to expected selector `"+selector+"`");
                ok( this.find(':not('+selector+')[role="'+role+'"]').length == 0, "Did not map `"+role+"` document structure to unexpected selectors");
            })
            stop();
        });
        start();
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Document Structure Mapping Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    asyncTest( "Roles polyfill doument structure role mappings", function() {
    
        $.each({'article':'article','nav':'navigation','section':'region'}, function( selector, role ){ 
            _.test('sectionsBasic', function(){
                this.ariaMapper()
                ok( this.find(selector+'[role="'+role+'"]').length == this.find(selector).length, "Mapped `"+role+"` document structure to expected selector `"+selector+"` ");
                ok( this.find(':not('+selector+')[role="'+role+'"]').length == 0, "Did not map `"+role+"` document structure to unexpected selectors");
            })
            stop();
        });
        
        _.test('sectionsBasic', function(){
            this.ariaMapper()
            ok( this.find('aside[role="complementary"]').length == this.find("aside:not(main aside)").length, "Mapped `complementary` document structure to expected selector `aside:not(main aside)` ");
            ok( this.find('[role="complementary"]:not(aside), main aside[role="complementary"]').length == 0, "Did not map `complementary` document structure to unexpected selectors");
        })
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Helper resolveLabeledBy Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest('Helper resolveLabeledBy resolution tests', function(){
    
        _.test('resolveLabeledBy', function(){
            this.ariaMapper();
            this.find('[data-label]').each(function(){
                var element = $(this),
                    selector = element.attr('data-label')
                ok(element.find(selector).attr('id') == element.attr('aria-labeledby'), "Properly resolved selector `"+selector+"` as label" )
            })
        })
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Disabling Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Roles polyfill disabled", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'polyfill':false})
            ok( this.find('[role]').length == 0, "No roles mapped when empty selector set and polyfill:false");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'polyfill':false}})
            ok( this.find('[role]').length == 0, "No roles mapped when empty selector set and roles.polyfill:false");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'polyfill':false,'selectors':{'banner':'> header'}}})
            console.log(this.find('[role]'))
            ok( this.find('[role]:not([role="banner"])').length == 0, "No polyfill roles mapped when roles.polyfill:false");
            ok( this.find('[role="banner"]').length == 1, "Explicity mapped roles.selectors mapped");
        });
        
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Callbacks
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Roles callbacks", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper();
            ok( this.find('[role="banner"]').attr('aria-labeledby'), "Polyfill callback invoked by default");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'callbacks':{'banner':function(){ this.attr('data-polyfill','success'); }}},
                    'callbacks':{'banner':function(){ this.attr('data-test','success'); }}
            }});
            ok( this.find('[role="banner"]').attr('data-test') == 'success', "User-defined callback invoked when set");
            ok( !this.find('[role="banner"]').attr('data-polyfill'), "Polyfill callback not invoked when user-defined callback is set and this.super() is not called");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'callbacks':{'banner':function(){ this.attr('data-polyfill','success'); }}},
                    'callbacks':{'banner':function(){ this.super(); this.attr('data-test','success'); }}
            }});
            ok( this.find('[role="banner"]').attr('data-polyfill'), "Polyfill callback invocable as this.super() from user-defined callback");
        });
        
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Callbacks
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Roles filters", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'filters':{'navigation':function(){ return $(this).closest('.-main').length == 0 }}}});
            ok( this.find('.-main [role="navigation"]').length == 0, "Filter removes values where it returns false");
            ok( this.find('[role="navigation"]').length > 0, "Filter leaves values where it returns true");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'filters':{'navigation':function(){ return this.closest('.-contentinfo').length == 0  }}},
                    'filters':{'navigation':function(){ return this.closest('.-main').length == 0 }}
            }});
            ok( this.find('.-main [role="navigation"]').length == 0, "User-defined filter overrides polyfill filter");
            ok( this.find('.-contentinfo [role="navigation"]').length > 0, "Polyfill filter not invoked when user-defined filter is set and this.super() is not used in return");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'filters':{'navigation':function(){ return this.closest('.-contentinfo').length == 0  }}},
                    'filters':{'navigation':function(){ return this.super() && this.closest('.-main').length == 0 }}
            }});
            ok( this.find('.-main [role="navigation"]').length == 0, "User-defined filter overrides polyfill filter");
            ok( this.find('.-contentinfo [role="navigation"]').length == 0, "Polyfill filter invocable as this.super() from user-defined filter");
            ok( this.find('[role="navigation"]').length > 0, "Filter leaves values where it returns true");
        });
        
    });
    
    asyncTest( "labeledBy", function(){
        
        _.test('labelChild', function(){
            this.ariaMapper({'labeledby':{'selectors':{
                'span.item': true
            }}});
            ok(this.find('.item').attr('aria-labeledby') == this.find('.label').attr('id'), 'Label properly assigned from child with default (`true`) labeledby selector')
        })
        
        stop();
        
        _.test('labelSibling', function(){
            this.ariaMapper({'labeledby':{'selectors':{
                'span.item': function(){ this.ariaMapperHelper('resolveLabeledBy', 'siblings', 'span.label') }
            }}})
            ok(this.find('.item').attr('aria-labeledby') == this.find('.label').attr('id'), 'Label properly assigned from sibling with custom resolveLabledBy invocation')
        })
        
    })
    

})(jQuery);