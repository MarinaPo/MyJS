function BuyingViewModel(app, dataModel) {
    var self = this;

    self.orders = ko.observableArray();
    self.filteredUsers = ko.observableArray();
    self.pageIndex = ko.observable(0);
    self.pageSize = ko.observable(10);
    self.numberOfShowItems = ko.observable(25);
    self.filteredOrders = ko.observableArray();
    self.inputForSearchText = ko.observable("");
   

    $.getJSON(dataModel.webApiUrl + "client").success(function (data) {
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

    self.clickSearchButton = function () {
        if (self.inputForSearchText() == "") self.filteredOrders(self.orders());
        else {
            var result = [];
            var count, counter;
          
                self.orders().forEach(function (item) {
                    $.each(item, function (key, val) {
                        if (self.inputForSearchText() == val)
                            result.push(item);
                   
                    });
                });
            

                self.filteredOrders(result);
        }
        self.pageIndexCheck();
    };

    self.showDeleteMessage = function (item) {
        $('.bs-modal-sm').modal('show');
        self.activeOrder(item);
    };

    self.deleteUser = function () {
        $('.bs-modal-sm').modal('hide');
        dataModel.webApiRequest('delete', "client/" + self.activeOrder.peek().clientId, null)
        .done(function () {
            self.orders.remove(self.activeOrder.peek());
            self.filteredOrders(self.orders());
        })
        .fail(function (jqXHR, textStatus) {
            if (jqXHR.status == 500) {
                $('.delete-fail').modal('show');
            }
        });

    };
}


app.addViewModel({
    name: "Buying",
    bindingMemberName: "buying",
    factory: BuyingViewModel
});