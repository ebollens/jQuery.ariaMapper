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
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 
     *    WebBlocks Tests
     * 
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    asyncTest( "WebBlocks facade", function() {
        
        ok( typeof $.fn.ariaWebBlocksMapper == 'function' , "Module ariaWebBlocksMapper is available on jQuery.fn" );
        
        _.test('sectionsWebBlocks', function(){
            
            this.ariaWebBlocksMapper();
            
            // var helpers
            var header = this.find('[role="banner"]'),
                mainContainer = this.find('#main-container'),
                main = this.find('main');
                
            // header with banner role and label
            ok(header.find('hgroup + nav.search + nav.mega').length == 1, "Resolved header as `banner`");
            ok(header.attr('aria-labeledby') == header.children('hgroup').attr('id'), "Resolved label for `banner`");
            
            // header navs with proper roles and labels
            ok(header.children('nav.search').attr('role') == 'search', "Resolved `header > nav.search` with role `search`");
            ok(header.children('nav.mega').attr('role') == 'navigation', "Resolved `header > nav.mega` with role `navigation`");
            header.children('nav').each(function(){
                var nav = $(this);
                ok(nav.attr('aria-labeledby') && nav.attr('aria-labeledby') == nav.children('h1').attr('id'), "Resolved label for `header > nav."+nav.attr('class')+"`");
            })
            
            // elements adjacent to main have proper roles
            ok(mainContainer.find('nav:not(main nav)').attr('role') == 'navigation', "Resolved `#main-container nav:not(main nav)` with role `navigation`");
            ok(mainContainer.find('aside:not(main aside)').attr('role') == 'complementary', "Resolved `#main-container aside:not(main aside)` with role `complementary`");
            
            // main with main role
            ok(main.attr('role') == 'main', 'Resolved `main` with role `main`');
            
            // article with article role
            this.find('article').each(function(){
                ok($(this).attr('role') == 'article', 'Resolved `article` with role `article`');
                ok($(this).attr('aria-labeledby') && $(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `article` as labeled by `header`');
            })
            
            // messages with alert role
            $.each(['error','danger','important','required'], function(){
                var type = this;
                main.find('div.message.'+type).each(function(){
                    ok($(this).attr('role') == 'alert', 'Resolved `div.message.'+type+'` with role `alert`');
                    ok($(this).attr('aria-labeledby') && $(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `div.message.'+type+'` as labeled by `header`');
                })
            })
            
            // messages with status role
            $.each(['highlight','success','warning','info'], function(){
                var type = this;
                main.find('div.message.'+type).each(function(){
                    ok($(this).attr('role') == 'status', 'Resolved `div.message.'+type+'` with role `status`');
                    ok($(this).attr('aria-labeledby') && $(this).attr('aria-labeledby') == $(this).children('header').attr('id'), 'Resolved `div.message.'+type+'` as labeled by `header`');
                })
            })
            
            main.find('form div.control label:not(:first-child) input').each(function(){
                ok($(this).attr('aria-labeledby') && $(this).attr('aria-labeledby') == $(this).closest('.control').children().first().attr('id'), 'Form control checkset labeledby acquired');
            })
        });
        
    });
    

})(jQuery);