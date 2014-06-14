function NumberViewModel(app, dataModel) {
    var self = this;

    self.orders = ko.observableArray();

    self.pageIndex = ko.observable(0);
    self.pageSize = ko.observable(10);
    self.numberOfShowItems = ko.observable(25);
    self.filteredOrders = ko.observableArray();



    $.getJSON(dataModel.webApiUrl + "salary").success(function (data) {
        self.orders(data);
        self.filteredUsers(self.orders());
        self.pageIndex(self.filteredUsers().length > 0 ? 1 : 0);
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



  

    self.pagedRows = ko.computed(function () {
        var size = this.pageSize();
        var start = (this.pageIndex() - 1) * size;
        return self.filteredOrders.slice(start, start + size);
    }, this);
}

app.addViewModel({
    name: "Number",
    bindingMemberName: "number",
    factory: NumberViewModel
});