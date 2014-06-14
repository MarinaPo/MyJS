function AdministrationViewModel(app, dataModel) {
    var self = this;

    var columnName = function (showName, name) {
        this.showName = showName;
        this.name = name;
    };

    self.selectField = ko.observableArray([
        new columnName("All Columns", ""),
        new columnName("User Name", "userName"),
        new columnName("First Name", "firstName"),
        new columnName("Last Name", "lastName"),
        new columnName("Role", "role")
    ]);
    self.chooseField = ko.observable("userName");
    self.selectCondition = ko.observableArray(["Equals", "Not equal to", "Starts with", "Contains", "Does not contain"]);
    self.chooseCondition = ko.observable("Starts with");

    self.users = ko.observableArray();
    
    self.pageIndex = ko.observable(0);
    self.pageSize = ko.observable(10);
    self.numberOfShowItems = ko.observable(25);

    self.inputForSearchText = ko.observable("");

    self.filteredUsers = ko.observableArray();

    self.register = function () {
        dataModel.user(0);
        dataModel.status("Create");
        app.navigateToRegister();
    };

    
    $.getJSON(dataModel.webApiUrl + "user").success(function (data) {
        self.users(data);
        self.filteredUsers(self.users());
        self.pageIndex(self.filteredUsers().length > 0 ? 1 : 0);
        self.pageIndexCheck();
        self.sort(self.tableHeaders()[0]);
    });

    self.numberOfFoundUsers = ko.computed(function () {
        return self.filteredUsers().length;
    }, this);

    self.pageIndexCheck = function () {
        if (self.pageIndex() > self.maxPageIndex()) {
            self.pageIndex(self.maxPageIndex());
        }
        else if (self.maxPageIndex() > 0 && self.pageIndex() == 0) {
            self.pageIndex(1);
        }
    };

    self.changeNumberOfItems = function () {
        if (self.pageSize() == 10) {
            self.pageSize(25);
            self.numberOfShowItems(10);
            self.pageIndexCheck();
        }
        else {
            self.pageSize(10);
            self.numberOfShowItems(25);
        }
    };

    self.previousPage = function () {
        self.pageIndex(self.pageIndex() - 1);
    };

    self.nextPage = function () {
        self.pageIndex(self.pageIndex() + 1);
    };

    self.navigationToFirst = function () {
        self.pageIndex(1);
    };

    self.navigationToLast = function () {
        self.pageIndex(self.maxPageIndex());
    };

    self.maxPageIndex = ko.computed(function () {
        return Math.ceil(this.filteredUsers().length / this.pageSize());
    }, this);


    self.pagedRows = ko.computed(function () {
        var size = this.pageSize();
        var start = (this.pageIndex() - 1) * size;
        return self.filteredUsers.slice(start, start + size);
    }, this);


    self.clickSearchButton = function () {
        if (self.inputForSearchText() == "") self.filteredUsers(self.users());
        else {
            var result = [];
            var count, counter;
            if (self.chooseField() == "") {
                self.users().forEach(function (item) {
                    count = 0;
                    counter = 0;
                    $.each(item, function (key, val) {
                        count++;
                        if (self.searchElementByCondition(val)) {
                            counter++;
                        }
                    });
                    if (self.chooseCondition() == "Does not contain" || self.chooseCondition() == "Not equal to") {
                        if (counter == count) result.push(item);
                    }
                    else {
                        if (counter > 0) result.push(item);
                    }
                });
            }
            else {
                self.users().forEach(function (item) {
                    $.each(item, function (key, val) {
                        if (key == self.chooseField() && self.searchElementByCondition(val)) {
                            result.push(item);
                        }
                    });
                });
            }
            
            self.filteredUsers(result);
        }
        self.pageIndexCheck();
    };

    self.searchElementByCondition = function (value) {
        switch (self.chooseCondition()) {
            case 'Equals':
                if (value.toLowerCase() == self.inputForSearchText().toLowerCase()) {
                    return true;
                }
                return false;
            case 'Not equal to':
                if (value.toLowerCase() != self.inputForSearchText().toLowerCase()) {
                    return true;
                }
                return false;
            case 'Starts with':
                if (value.toLowerCase().indexOf(self.inputForSearchText().toLowerCase()) == 0) {
                    return true;
                }
                return false;
            case 'Contains':
                if (value.toLowerCase().indexOf(self.inputForSearchText().toLowerCase()) >= 0) {
                    return true;
                }
                return false;
            case 'Does not contain':
                if (value.toLowerCase().indexOf(self.inputForSearchText().toLowerCase()) == -1) {
                    return true;
                }
                return false;
        }
    };

    self.tableHeader = function (title, name) {
        this.title = title;
        this.name = name;
        this.asc = true;
    };

    self.tableHeaders = ko.observableArray([
        new self.tableHeader("User Name", "userName"),
        new self.tableHeader("First Name", "firstName"),
        new self.tableHeader("Last Name", "lastName"),
        new self.tableHeader("Role", "role"),
        new self.tableHeader("Email", "email"),
        new self.tableHeader("Region", "region")
    ]);

    self.sortOnCtrlKeyDown = function (header, event) {
        if (event.ctrlKey) {
            self.sort(header);
        };
    };

    self.activeSort = ko.observable(self.tableHeaders()[0]);

    self.sort = function (header) {
        if (self.activeSort === header) {
            header.asc = !header.asc;
        }
        else {
            self.activeSort = header;
        }
        var prop = header.name;
        var ascSort = function (a, b) { return a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : a[prop] == b[prop] ? 0 : 0; };
        var descSort = function (a, b) { return a[prop] > b[prop] ? -1 : a[prop] < b[prop] ? 1 : a[prop] == b[prop] ? 0 : 0; };
        var sortFunction = self.activeSort.asc ? ascSort : descSort;
        self.filteredUsers.sort(sortFunction);
    };

    self.showEditUserPage = function (item) {
        dataModel.user(item);
        dataModel.status("Update");
        app.navigateToRegister();
    };

    self.activeUser = ko.observable(0);

    self.showDeleteMessage = function (item) {
        $('.bs-modal-sm').modal('show');
        self.activeUser(item);
    };

    self.deleteUser = function () {
        $('.bs-modal-sm').modal('hide');
        dataModel.webApiRequest('delete', "user/" + self.activeUser.peek().userId, null)
        .done(function () {
            self.users.remove(self.activeUser.peek());
            self.filteredUsers(self.users());
        })
        .fail(function (jqXHR, textStatus) {
            if (jqXHR.status == 500) {
                $('.delete-fail').modal('show');
            }
        });
        
    };

    self.showDuplicateUserPage = function (item) {
        var data = item;
        data.userName = "";
        dataModel.user(data);
        dataModel.status("Duplicate");
        app.navigateToRegister();
    };
}

app.addViewModel({
    name: "Administration",
    bindingMemberName: "administration",
    factory: AdministrationViewModel
});