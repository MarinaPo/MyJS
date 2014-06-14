function UserInfoViewModel(app, name, dataModel) {
    var self = this;

    // Data
    self.name = ko.observable(name);
    self.currentUserRole = ko.validatedObservable(sessionStorage["userRole"]);

    // Operations
    self.logOff = function () {

        if (confirm('Are you sure you want to log out from the application?'))
            dataModel.logout().done(function () {
                app.navigateToLoggedOff();
            }).fail(function () {
                app.errors.push("Log off failed.");
            });
        else;

        ////native code
        //dataModel.logout().done(function () {
        //    app.navigateToLoggedOff();
        //}).fail(function () {
        //    app.errors.push("Log off failed.");
        //});

    };

    self.manage = function () {
        app.navigateToManage();
    };

    self.toadministration = function () {
        app.navigateToAdministration();
    };

    self.toorderlist = function () {
        app.navigateToOrderList();
    };

    self.toitems = function () {
        app.navigateToItemManagement();
    };


    //===============Data for User Info modal Window====BEGIN==========================
    self.loggedUserName = ko.observable("Logged User: " + name);

    self.customerFullName = ko.observable("data loading...");
    self.customerRole = ko.observable("data loading...");
    self.customerType = ko.observable("data loading...");
    self.customerBalance = ko.observable("data loading...");
    self.customerInformationText = ko.observable("data loading...");

    self.getCustomerInfo = function () {
        $.getJSON(dataModel.webApiUrl + "customerinfo/?userName=" + self.name(),
            function (data) {
                self.customerFullName(data.customerFullName);
                self.customerRole(data.userRole);
                self.customerType(data.customerType);
                self.customerBalance(data.customerBalance);
                self.customerInformationText(self.composeInformationText(data.customerBalance));

               // alert(self.composeInformationText(data.customerBalance));
            }
        );

    };

    self.composeInformationText = function (inValue) {

        if (inValue >= 10000) {
            return "";
        };
        if (inValue >= 3000) {
            return "*Need to spend " + (10000 - inValue) + "$ more to become a Platinum type of customer";
        };
        if (inValue >= 1000) {
            return "*Need to spend " + (3000 - inValue) + "$ more to become a Gold type of customer";
        };
        if (inValue >= 0) {
            return "*Need to spend " + (1000 - inValue) + "$ more to become a Silver type of customer";
        };

    };

    //===============Data for User Info modal Window====END==========================

    self.tabOrderingVisible = ko.observable(false);
    self.tabAdministrationVisible = ko.observable(false);
    self.tabItemsManagementVisible = ko.observable(false);
    self.tabOrdering = ko.observable("");
    self.tabAdministration = ko.observable("");
    self.tabItemsManagement = ko.observable("");


    switch (sessionStorage["userRole"]) {
        case "Administrator":
            self.tabAdministration("active");
            self.tabAdministrationVisible(true);
        break;
        case "Merchandiser":
            self.tabOrdering("active");
            self.tabOrderingVisible(true);
            break;
        case "Customer":
            self.tabOrdering("active");
            self.tabOrderingVisible(true);
            break;
        case "Supervisor":
            self.tabItemsManagement("active");
            self.tabItemsManagementVisible(true);
            break;
        }

    
}


