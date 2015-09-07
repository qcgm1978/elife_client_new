/**
 * Description:
 *
 * @module
 */
describe('$q', function () {
    it('should simulate promise', inject(function ($q, $rootScope) {
        expect(true).toBeTruthy()
        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolvedValue;
        promise.then(function (value) {
            expect(value).toEqual(123)
            resolvedValue = value;
            //throw Error
        });
        expect(resolvedValue).toBeUndefined();
        // Simulate resolving of promise
        deferred.resolve(123);
        // Note that the 'then' function does not get called synchronously.
        // This is because we want the promise API to always be async, whether or not
        // it got called synchronously or asynchronously.
        expect(resolvedValue).toBeUndefined();
        // Propagate promise resolution to 'then' functions using $apply().
        $rootScope.$apply();
        expect(resolvedValue).toEqual(123);
    }));
    it('es6 style promise', inject(function ($q, $rootScope) {
        function asyncGreet(name) {
            // perform some asynchronous operation, resolve or reject the promise when appropriate.
            return $q(function (resolve, reject) {
                setTimeout(function () {
                    if (okToGreet(name)) {
                        resolve('Hello, ' + name + '!');
                    } else {
                        reject('Greeting ' + name + ' is not allowed.');
                    }
                    $rootScope.$apply()
                    expect(foo).toEqual('Hello, Robin Hood');
                }, 1000);
            });
        }

        var foo = ''
        var promise = asyncGreet('Robin Hood');
        promise.then(function (greeting) {
            foo = greeting
        }, function (reason) {
            expect('Failed: ' + reason);
        });
    }))
})

