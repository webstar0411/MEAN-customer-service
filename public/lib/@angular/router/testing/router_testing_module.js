/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Location, LocationStrategy } from '@angular/common';
import { MockLocationStrategy, SpyLocation } from '@angular/common/testing';
import { Compiler, Injectable, Injector, NgModule, NgModuleFactoryLoader } from '@angular/core';
import { NoPreloading, PreloadingStrategy, Router, RouterModule, RouterOutletMap, UrlSerializer, provideRoutes } from '@angular/router';
import { ROUTER_PROVIDERS, ROUTES, flatten } from './private_import_router';
/**
 * @whatItDoes Allows to simulate the loading of ng modules in tests.
 *
 * @howToUse
 *
 * ```
 * const loader = TestBed.get(NgModuleFactoryLoader);
 *
 * @Component({template: 'lazy-loaded'})
 * class LazyLoadedComponent {}
 * @NgModule({
 *   declarations: [LazyLoadedComponent],
 *   imports: [RouterModule.forChild([{path: 'loaded', component: LazyLoadedComponent}])]
 * })
 *
 * class LoadedModule {}
 *
 * // sets up stubbedModules
 * loader.stubbedModules = {lazyModule: LoadedModule};
 *
 * router.resetConfig([
 *   {path: 'lazy', loadChildren: 'lazyModule'},
 * ]);
 *
 * router.navigateByUrl('/lazy/loaded');
 * ```
 *
 * @stable
 */
export var SpyNgModuleFactoryLoader = (function () {
    function SpyNgModuleFactoryLoader(compiler) {
        this.compiler = compiler;
        /**
         * @docsNotRequired
         */
        this.stubbedModules = {};
    }
    SpyNgModuleFactoryLoader.prototype.load = function (path) {
        if (this.stubbedModules[path]) {
            return this.compiler.compileModuleAsync(this.stubbedModules[path]);
        }
        else {
            return Promise.reject(new Error("Cannot find module " + path));
        }
    };
    SpyNgModuleFactoryLoader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SpyNgModuleFactoryLoader.ctorParameters = [
        { type: Compiler, },
    ];
    return SpyNgModuleFactoryLoader;
}());
/**
 * Router setup factory function used for testing.
 *
 * @stable
 */
export function setupTestingRouter(urlSerializer, outletMap, location, loader, compiler, injector, routes) {
    return new Router(null, urlSerializer, outletMap, location, injector, loader, compiler, flatten(routes));
}
/**
 * @whatItDoes Sets up the router to be used for testing.
 *
 * @howToUse
 *
 * ```
 * beforeEach(() => {
 *   TestBed.configureTestModule({
 *     imports: [
 *       RouterTestingModule.withRoutes(
 *         [{path: '', component: BlankCmp}, {path: 'simple', component: SimpleCmp}])]
 *       )
 *     ]
 *   });
 * });
 * ```
 *
 * @description
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of {@link Location}, {@link LocationStrategy}, and {@link
 * NgModuleFactoryLoader}.
 *
 * @stable
 */
export var RouterTestingModule = (function () {
    function RouterTestingModule() {
    }
    RouterTestingModule.withRoutes = function (routes) {
        return { ngModule: RouterTestingModule, providers: [provideRoutes(routes)] };
    };
    RouterTestingModule.decorators = [
        { type: NgModule, args: [{
                    exports: [RouterModule],
                    providers: [
                        ROUTER_PROVIDERS, { provide: Location, useClass: SpyLocation },
                        { provide: LocationStrategy, useClass: MockLocationStrategy },
                        { provide: NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader }, {
                            provide: Router,
                            useFactory: setupTestingRouter,
                            deps: [
                                UrlSerializer, RouterOutletMap, Location, NgModuleFactoryLoader, Compiler, Injector, ROUTES
                            ]
                        },
                        { provide: PreloadingStrategy, useExisting: NoPreloading }, provideRoutes([])
                    ]
                },] },
    ];
    /** @nocollapse */
    RouterTestingModule.ctorParameters = [];
    return RouterTestingModule;
}());
//# sourceMappingURL=router_testing_module.js.map