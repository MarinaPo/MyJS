function OrderListViewModel(app, dataModel) {
    var self = this;

    //Array of orders from WebAPI with JSON
    self.orders = ko.observableArray([]);
    //Initialization the orders array and sorting it by OrderName desc 

    self.returnUserLogin = function() {

        if (app.user() != null && app.user() != undefined) {
            return app.user().name();
        } else {
            return "";
        }
    };

    dataModel.webApiRequest('get', "order/?UserLogin=" + self.returnUserLogin(), null)
    .done(function (data) {
        self.orders(data);
        self.orders.sort(function (left, right) {
            return left.OrderName == right.OrderName ? 0 :
            (left.OrderName < right.OrderName ? -1 : 1);
        });
    });



    //$.getJSON(dataModel.webApiUrl + "order",
    //    function(data) {
    //        self.orders(data);
    //        self.orders.sort(function (left, right) {
    //            return left.OrderName == right.OrderName ? 0 :
    //            (left.OrderName < right.OrderName ? -1 : 1);
    //        });
    //    }
    //);

    //Visible of "New Order" button
    self.isCustomer = ko.observable((sessionStorage["userRole"] == "Customer") ? true : false);

    self.newOrder = function () {
        app.navigateToHome();
    };

    self.editCurrentOrder = function (order) {
        sessionStorage["orderId"] = order.OrderId;
        app.navigateToBuying();
    };


    //===============Filtering and searching BEGIN==================
    //Filters
    self.filterTypes = ko.observableArray(['Status', 'Role']);
    self.selectedFilterType = ko.observable();
    self.statusTypes = ko.observableArray(['None', 'Ordered', 'Pending', 'Delivered']);
    self.selectedCurrentStatus = ko.observable();
    self.roleTypes = ko.observableArray(['None', 'Merchandiser', 'Administrator', 'Supervisor']);
    self.selectedCurrentRole = ko.observable();
    
    self.filterStatusVisible = ko.computed(function () {
        if (self.selectedFilterType() == 'Status') {
            return true;
        }
        else
        {
            return false;
        }
    }, this);

    self.filterRoleVisible = ko.computed(function () {
        if (self.selectedFilterType() == 'Role') {
            return true;
        }
        else {
            return false;
        }
    }, this);

    //Search
    self.searchTypes = ko.observableArray(['OrderName', 'Status', 'Asignee']);
    self.selectedSearchType = ko.observable();

    self.searchText = ko.observable();

    //String for geting filtered|searched list from WebAPI
    self.FilteringSearchingSorting = function () {
        var returnedValue = '';

        //Add filter
        if (self.selectedFilterType() == 'Status' && self.selectedCurrentStatus() != 'None') {
            returnedValue = returnedValue + 'Filter=Status' + self.selectedCurrentStatus();
        }
        if (self.selectedFilterType() == 'Role' && self.selectedCurrentRole() != 'None') {
            returnedValue = returnedValue + 'Filter=Role' + self.selectedCurrentRole();
        }

        //Add search
        if (self.searchText() != '' && self.searchText() != undefined)
        {
            if (returnedValue != '') {
                returnedValue = returnedValue +  '&' ;
            }
            returnedValue = returnedValue + 'SearchType=' + self.selectedSearchType() + '&Search=' + self.searchText();
        }

        //Add question mark
        if (returnedValue != '') {
            returnedValue = '&' + returnedValue;
        }

        returnedValue = '/?UserLogin=' + self.returnUserLogin() + returnedValue;

        return returnedValue;
    };

    //Get filtered and searchen data fom WebAPI
    //Sorting it by OrderName desc 
    self.clickApplyButton = function () {

        dataModel.webApiRequest('get', 'order' + self.FilteringSearchingSorting(), null)
        .done(function (data) {
            self.orders(data);
            self.orders.sort(function (left, right) {
                return left.OrderName == right.OrderName ? 0 :
                (left.OrderName < right.OrderName ? -1 : 1);
            });
            self.ReinitializeSortValues(0);
            self.currentOrderOfOrderName(1);
            self.ReinitializeSortArrows();
        });


    };

    //===============Filtering and searching END==================

    //=================Sort functions BEGIN==============

  //Sort by OrderName
    self.currentOrderOfOrderName = ko.observable(1);
    self.clickChangeOrderOfOrderName = function () {
        self.reverseSortValue(self.currentOrderOfOrderName);

        self.orders.sort(function(left, right) {
            return left.OrderName == right.OrderName ? 0 :
            (left.OrderName < right.OrderName ? -1 * self.currentOrderOfOrderName() :
                1 * self.currentOrderOfOrderName());
        });
    };

    //Sort by TotalPrice
    self.currentOrderOfTotalPrice = ko.observable(0);
    self.clickChangeOrderOfTotalPrice = function () {
        self.reverseSortValue(self.currentOrderOfTotalPrice);

        self.orders.sort(function(left, right) {
            return left.TotalPrice == right.TotalPrice ? 0 :
            (left.TotalPrice < right.TotalPrice ? -1 * self.currentOrderOfTotalPrice() :
                1 * self.currentOrderOfTotalPrice());
        });
    };

    //Sort by MaxDiscount
    self.currentOrderOfMaxDiscount = ko.observable(0);
    self.clickChangeOrderOfMaxDiscount = function () {
        self.reverseSortValue(self.currentOrderOfMaxDiscount);

        self.orders.sort(function(left, right) {
            return left.MaxDiscount == right.MaxDiscount ? 0 :
            (left.MaxDiscount < right.MaxDiscount ? -1 * self.currentOrderOfMaxDiscount() :
                1 * self.currentOrderOfMaxDiscount());
        });
    };

    //Sort by DeliveryDate
    self.currentOrderOfDeliveryDate = ko.observable(0);
    self.clickChangeOrderOfDeliveryDate = function () {
        self.reverseSortValue(self.currentOrderOfDeliveryDate);

        self.orders.sort(function(left, right) {
            return left.DeliveryDate == right.DeliveryDate ? 0 :
            (left.DeliveryDate < right.DeliveryDate ? -1 * self.currentOrderOfDeliveryDate() :
                1 * self.currentOrderOfDeliveryDate());
        });
    };
    
    //Sort by Status
    self.currentOrderOfStatus = ko.observable(0);
    self.clickChangeOrderOfStatus = function () {
        self.reverseSortValue(self.currentOrderOfStatus);

        self.orders.sort(function(left, right) {
            return left.OrderStatus == right.OrderStatus ? 0 :
            (left.OrderStatus < right.OrderStatus ? -1 * self.currentOrderOfStatus() :
                1 * self.currentOrderOfStatus());
        });
    };

   //Sort by Assignee
    self.currentOrderOfAssignee = ko.observable(0);
    self.clickChangeOrderOfAssignee = function () {
        self.reverseSortValue(self.currentOrderOfAssignee);

        self.orders.sort(function(left, right) {
            return left.AssigneeName == right.AssigneeName ? 0 :
            (left.AssigneeName < right.AssigneeName ? -1 * self.currentOrderOfAssignee() :
                1 * self.currentOrderOfAssignee());
        });
    };
    
    //Sort by Role
    self.currentOrderOfRole = ko.observable(0);
    self.clickChangeOrderOfRole = function () {
        self.reverseSortValue(self.currentOrderOfRole);

        self.orders.sort(function(left, right) {
            return left.AssigneeRole == right.AssigneeRole ? 0 :
            (left.AssigneeRole < right.AssigneeRole ? -1 * self.currentOrderOfRole() :
                1 * self.currentOrderOfRole());
        });
    };
    
    //Reinitialization the sorting values
    self.ReinitializeSortValues = function(inValue) {

        self.currentOrderOfOrderName(inValue);
        self.currentOrderOfTotalPrice(inValue);
        self.currentOrderOfMaxDiscount(inValue);
        self.currentOrderOfDeliveryDate(inValue);
        self.currentOrderOfStatus(inValue);
        self.currentOrderOfAssignee(inValue);
        self.currentOrderOfRole(inValue);

    };

    self.arrowOrderName = ko.observable("arrow-text-chevron-down");
    self.arrowTotalPrice = ko.observable("arrow-text-chevron-both");
    self.arrowMaxDiscount = ko.observable("arrow-text-chevron-both");
    self.arrowDeliveryDate = ko.observable("arrow-text-chevron-both");
    self.arrowStatus = ko.observable("arrow-text-chevron-both");
    self.arrowAssignee = ko.observable("arrow-text-chevron-both");
    self.arrowRole = ko.observable("arrow-text-chevron-both");

    //Reinitialization the sorting values
    self.ReinitializeSortArrows = function () {

        self.ArrowStyleBySortOrder(self.currentOrderOfOrderName, self.arrowOrderName);
        self.ArrowStyleBySortOrder(self.currentOrderOfTotalPrice, self.arrowTotalPrice);
        self.ArrowStyleBySortOrder(self.currentOrderOfMaxDiscount, self.arrowMaxDiscount);
        self.ArrowStyleBySortOrder(self.currentOrderOfDeliveryDate, self.arrowDeliveryDate);
        self.ArrowStyleBySortOrder(self.currentOrderOfStatus, self.arrowStatus);
        self.ArrowStyleBySortOrder(self.currentOrderOfAssignee, self.arrowAssignee);
        self.ArrowStyleBySortOrder(self.currentOrderOfRole, self.arrowRole);

    };

    //Set arrow css style for columns headers by current sorting order
    self.ArrowStyleBySortOrder = function (inValueSortOrder, inValueArrowStyle) {

        if (inValueSortOrder() == 1) {
            inValueArrowStyle("arrow-text-chevron-down");
        }
        if (inValueSortOrder() == 0) {
            inValueArrowStyle("arrow-text-chevron-both");
        }
        if (inValueSortOrder() == -1) {
            inValueArrowStyle("arrow-text-chevron-up");
        }

    };

    //Changes sign of passed value and reinitialization other sorting values
    self.reverseSortValue = function(inValue) {
        var prvValue = inValue();
        self.ReinitializeSortValues(0);
        if (prvValue == -1 || prvValue == 0) {
            inValue(1);
        }
        if (prvValue == 1) {
            inValue(-1);
        }

        self.ReinitializeSortArrows();
    };

    //=================Sort functions END==============

    //=================Delete Order functions BEGIN================
    self.idOrderForDelete = ko.observable();
    self.warningOrderForDelete = ko.observable();
    self.warningOrderDeleteFail = ko.observable();
    self.warningOrderDeleteSuccess = ko.observable();

    self.showDeleteOrderDialog = function () {
        self.idOrderForDelete(this);
        self.warningOrderForDelete(this.OrderName + " will be deleted from the List of Orders.");
        self.warningOrderDeleteFail(this.OrderName + " was already deleted from the List of Orders by another user.");
        self.warningOrderDeleteSuccess(this.OrderName + " was successfully deleted from the List of Orders.");
        $('.deleteorderdialog').modal('show');
    };

    self.deleteOrder = function () {
        $('.deleteorderdialog').modal('hide');
        dataModel.webApiRequest('delete', "order/" + self.idOrderForDelete().OrderId, null)
        .done(function () {
            self.orders.remove(self.idOrderForDelete());
            $('.deleteorderdialogsuccess').modal('show');
            //self.clickApplyButton();
        })
        .fail(
        function (jqXHR, textStatus) {
            if (jqXHR.status == 500) {
                self.orders.remove(self.idOrderForDelete());
                $('.deleteorderdialogfail').modal('show');
            }
        }
        );
    };

    self.deleteURL = ko.observable();

    //self.clickDeleteOrder = function () {

    //    if (confirm('Are you sure you want to log out from the application?')) {

    //        var currentOrder = this;

    //        self.deleteURL(dataModel.webApiUrl + "order/" + currentOrder.OrderId);

    //        return $.ajax({
    //            url: dataModel.webApiUrl + "order/" + currentOrder.OrderId,
    //            type: 'DELETE',
    //            success: function(result) { self.clickApplyButton(); }

    //        });
    //    } else {
    //        return "!!!";
    //    }

    //};

    //=================Delete Order functions END================


}

app.addViewModel({
    name: "OrderList",
    bindingMemberName: "orderlist",
    factory: OrderListViewModel
});