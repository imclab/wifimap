

module("Callbacks registration");

test("register url load callback", function() {
    expect(3);
    
    ok( !('/spots/add' in Page.loadCallbacks), "url /spots/add NOT registered to load" );
    
    Page.registerLoadUrl('/spots/add', function() {});
    
    ok( '/spots/add' in Page.loadCallbacks, "url /spots/add registered to load" );

    Page.registerLoadUrl('/spots/add', function() {});
    
    equals( Page.loadCallbacks['/spots/add'].length, 2, "now have 2 load callbacks" );
    
});

test("register url unload callback", function() {
    expect(3);
    
    ok( !('/spots/add' in Page.unloadCallbacks), "url /spots/add NOT registered to unload" );

    Page.registerUnloadUrl('/spots/add', function() {});
    
    ok( '/spots/add' in Page.unloadCallbacks, "url /spots/add registered to unload" );
    
    Page.registerUnloadUrl('/spots/add', function() {});
    
    equals( Page.unloadCallbacks['/spots/add'].length, 2, "now have 2 unload callbacks" );
});

test("Loading page", function() {
    expect(3);
    
    Page.registerLoadUrl('^/', function() {
        ok(1, "Called every time");
    });
    
    Page.registerLoadUrl('^/spots/search$', function(){
        ok(1, "Called first");
    });
    Page.registerLoadUrl('^/spots/search$', function(){
        ok(1, "Called later");
    });
    
    Page.registerLoadUrl('^/spots$', function() {
        ok(0, "Can't be called");
    });
    
    Page.load("/spots/search");
    
});

test("Load can't modifie location.hash", function(){
    
    Page.registerLoadUrl('^/spots/add$', function(){
        ok( 1, "loaded" );
    });
    
    Page.load("/spots/add");
    
    equals( window.location.hash, "" );
    
});

test("Load to a new page, means unload the current one", function() {
    expect(3);
    Page.lastUrl = "/";
    
    Page.registerLoadUrl('^/spots', function(){
        ok( 1, "Loading /spots" );
    });
    Page.registerUnloadUrl('^/', function() {
        ok( 1, "Unload /" );
    });
    Page.registerUnloadUrl('^/', function() {
        ok( 1, "Unload /... second :)" );
    });
    
    Page.registerUnloadUrl('^/spots/add$', function() {
        ok( 0, "Hey, I shouldn't be called!" );
    });
    
    Page.load("/spots");
    
});

test("When loading a new page, update Page.lastUrl", function() {
    
    Page.lastUrl = "/spots/add";
    
    Page.load("/");
    
    equals( Page.lastUrl, "/" );
    
});

test("Initial load", function() {
    expect(2);
    
    Page.registerLoadUrl('^/$', function() {
        ok( 1, "Loading /" );
    });
    
    Page.initialLoad();
    
    Page.registerLoadUrl('^/spots/add', function() {
        ok( 1, "Loading /spots/add" );
    });
    
    window.location.hash = "#/spots/add";
    
    Page.initialLoad();
    
});

start();

QUnit.testStart = function(name) {
    Page.clear();
    Page.init();
};

QUnit.testDone = function(name, failures, total) {
    window.location.hash = "";
}
