function HomeViewModel(app, dataModel) {
    self.orders = ko.observableArray();

    self.pageIndex = ko.observable(0);
    self.pageSize = ko.observable(10);
    self.numberOfShowItems = ko.observable(25);
    self.filteredOrders = ko.observableArray();



    $.getJSON(dataModel.webApiUrl + "worker").success(function (data) {
        self.orders(data);
        self.filteredOrders(self.orders());
        self.pageIndex(self.filteredOrders().length > 0 ? 1 : 0);
        self.pageIndexCheck();
        self.sort(self.tableHeaders()[0]);
    });



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
        return Math.ceil(this.filteredOrders().length / this.pageSize());
    }, this);


    self.pagedRows = ko.computed(function () {
        var size = this.pageSize();
        var start = (this.pageIndex() - 1) * size;
        return self.filteredOrders.slice(start, start + size);
    }, this);

}

app.addViewModel({
    name: "Home",
    bindingMemberName: "home",
    factory: HomeViewModel
});
