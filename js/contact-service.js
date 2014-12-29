var contactService = (function () {

    "use strict";

    function findByName(searchKey) {
        var deferred = $.Deferred();
        var soql = 'SELECT Id, FirstName, LastName, Title FROM contact WHERE name LIKE \'%' + searchKey + '%\' LIMIT 50';
        force.query(soql,
            function (data) {
                deferred.resolve(data.records);
            },
            function(error) {
                if (error[0]) alert(error[0].message);
                deferred.reject(error);
            });
        return deferred.promise();
    }

    function findById(contactId) {
        var deferred = $.Deferred();
        var fieldList = ['Id', 'FirstName', 'LastName', 'Title', 'Department', 'Phone', 'MobilePhone', 'Email'];
        force.retrieve('Contact', contactId, fieldList,
            function(data) {
                deferred.resolve(data);
            },
            function(error) {
                if (error[0]) alert(error[0].message);
                deferred.reject(error);
            });
        return deferred.promise();
    }

    return {
        findByName: findByName,
        findById: findById
    };

}());