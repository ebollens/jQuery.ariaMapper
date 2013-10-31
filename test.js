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
        ok( typeof $.fn.ariaMapper == 'function' , "Module ariaMapper is available on jQuery.fn" );
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Polyfill Landmark Mapping Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Polyfill landmark role mappings", function() {
        
        $.each({'.-banner':'banner', '.-main':'main', '.-contentinfo':'contentinfo'}, function( selector, role ){
            _.test('sectionsBasic', function(){
                this.ariaMapper()
                ok( this.find(selector+'[aria-role="'+role+'"]').length == 1, "Mapped `"+role+"` document structure to expected selector `"+selector+"`");
                ok( this.find(':not('+selector+')[aria-role="'+role+'"]').length == 0, "Did not map `"+role+"` document structure to unexpected selectors");
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

    asyncTest( "Polyfill doument structure role mappings", function() {
    
        $.each({'article':'article','nav':'navigation','section':'region'}, function( selector, role ){ 
            _.test('sectionsBasic', function(){
                this.ariaMapper()
                ok( this.find(selector+'[aria-role="'+role+'"]').length == this.find(selector).length, "Mapped `"+role+"` document structure to expected selector `"+selector+"` ");
                ok( this.find(':not('+selector+')[aria-role="'+role+'"]').length == 0, "Did not map `"+role+"` document structure to unexpected selectors");
            })
            stop();
        });
        
        _.test('sectionsBasic', function(){
            this.ariaMapper()
            ok( this.find('aside[aria-role="complementary"]').length == this.find("aside:not(main aside)").length, "Mapped `complementary` document structure to expected selector `aside:not(main aside)` ");
            ok( this.find('[aria-role="complementary"]:not(aside), main aside[aria-role="complementary"]').length == 0, "Did not map `complementary` document structure to unexpected selectors");
        })
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Helper labeledByResolution Tests
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
    
    asyncTest( "Polyfill disabled", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'polyfill':false})
            ok( this.find('[aria-role]').length == 0, "No roles mapped when empty selector set and polyfill:false");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'polyfill':false}})
            ok( this.find('[aria-role]').length == 0, "No roles mapped when empty selector set and roles.polyfill:false");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'polyfill':false,'selectors':{'banner':'> header'}}})
            console.log(this.find('[aria-role]'))
            ok( this.find('[aria-role]:not([aria-role="banner"])').length == 0, "No polyfill roles mapped when roles.polyfill:false");
            ok( this.find('[aria-role="banner"]').length == 1, "Explicity mapped roles.selectors mapped");
        });
        
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Callbacks
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Callbacks", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper();
            ok( this.find('[aria-role="banner"]').attr('aria-labeledby'), "Polyfill callback invoked by default");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'callbacks':{'banner':function(){ this.attr('data-test','success'); }}}});
            ok( this.find('[aria-role="banner"]').attr('data-test') == 'success', "User-defined callback invoked when set");
            ok( !this.find('[aria-role="banner"]').attr('aria-labeledby'), "Polyfill callback not invoked when user-defined callback is set and this.super() is not called");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'callbacks':{'banner':function(){ this.super(); this.attr('data-test','success'); }}}});
            ok( this.find('[aria-role="banner"]').attr('aria-labeledby'), "Polyfill callback invocable as this.super() from user-defined callback");
        });
        
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    Callbacks
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    
    asyncTest( "Filters", function() {
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{'filters':{'navigation':function(){ return $(this).closest('.-main').length == 0 }}}});
            ok( this.find('.-main [aria-role="navigation"]').length == 0, "Filter removes values where it returns false");
            ok( this.find('[aria-role="navigation"]').length > 0, "Filter leaves values where it returns true");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'filters':{'navigation':function(){ return this.closest('.-contentinfo').length == 0  }}},
                    'filters':{'navigation':function(){ return this.closest('.-main').length == 0 }}
            }});
            ok( this.find('.-main [aria-role="navigation"]').length == 0, "User-defined filter overrides polyfill filter");
            ok( this.find('.-contentinfo [aria-role="navigation"]').length > 0, "Polyfill filter not invoked when user-defined filter is set and this.super() is not used in return");
        });
        
        stop();
        
        _.test('sectionsBasic', function(){
            this.ariaMapper({'roles':{
                    'polyfills':{'filters':{'navigation':function(){ return this.closest('.-contentinfo').length == 0  }}},
                    'filters':{'navigation':function(){ return this.super() && this.closest('.-main').length == 0 }}
            }});
            ok( this.find('.-main [aria-role="navigation"]').length == 0, "User-defined filter overrides polyfill filter");
            ok( this.find('.-contentinfo [aria-role="navigation"]').length == 0, "Polyfill filter invocable as this.super() from user-defined filter");
            ok( this.find('[aria-role="navigation"]').length > 0, "Filter leaves values where it returns true");
        });
        
    });
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    WebBlocks Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    asyncTest( "WebBlocks facade", function() {
        
        ok( typeof $.fn.ariaWebBlocksMapper == 'function' , "Module ariaWebBlocksMapper is available on jQuery.fn" );
        
        _.test('sectionsWebBlocks', function(){
            this.ariaWebBlocksMapper();
            var header = this.find('[aria-role="banner"]'),
                mainContainer = this.find('#main-container'),
                main = this.find('main');
            ok(header.find('hgroup + nav.search + nav.mega').length == 1, "Resolved header as `banner`");
            ok(header.attr('aria-labeledby') == header.children('hgroup').attr('id'), "Resolved label for `banner`");
            
            // header navs with proper roles and labels
            ok(header.children('nav.search').attr('aria-role') == 'search', "Resolved `header > nav.search` with role `search`");
            ok(header.children('nav.mega').attr('aria-role') == 'navigation', "Resolved `header > nav.mega` with role `navigation`");
            header.children('nav').each(function(){
                var nav = $(this);
                ok(nav.attr('aria-labeledby') == nav.children('h1').attr('id'), "Resolved label for `header > nav."+nav.attr('class')+"`");
            })
            
            // elements adjacent to main have proper roles
            ok(mainContainer.find('nav:not(main nav)').attr('aria-role') == 'navigation', "Resolved `#main-container nav:not(main nav)` with role `navigation`");
            ok(mainContainer.find('aside:not(main aside)').attr('aria-role') == 'complementary', "Resolved `#main-container aside:not(main aside)` with role `complementary`");
            
            // main with main role
            ok(main.attr('aria-role') == 'main', 'Resolved `main` with role `main`');
            
            // article with article role
            this.find('article').each(function(){
                ok($(this).attr('aria-role') == 'article', 'Resolved `article` with role `article`');
                ok($(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `article` as labeled by `header`');
            })
            
            // messages with alert role
            $.each(['error','danger','important','required'], function(){
                var type = this;
                main.find('div.message.'+type).each(function(){
                    ok($(this).attr('aria-role') == 'alert', 'Resolved `div.message.'+type+'` with role `alert`');
                    ok($(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `div.message.'+type+'` as labeled by `header`');
                })
            })
            
            // messages with status role
            $.each(['highlight','success','warning','info'], function(){
                var type = this;
                main.find('div.message.'+type).each(function(){
                    ok($(this).attr('aria-role') == 'status', 'Resolved `div.message.'+type+'` with role `status`');
                    ok($(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `div.message.'+type+'` as labeled by `header`');
                })
            })
        });
        
    });
    

})(jQuery);