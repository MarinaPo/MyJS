function AIViewModel(data) {
    if (!data) {
        data = {};
    }

    var self = this;
    self.name = data.name;
    self.description = data.description;

    // search
    self.items = ko.observableArray(testCustomers);
    self.filteredItems = ko.observableArray(self.items());

    self.searchField = function (title, name) {
        this.title = title;
        this.name = name;
        this.asc = true;
    };
    self.searchFields = ko.observableArray([
        new self.searchField("Item Name", "name"),
        new self.searchField("Item Description", "description")
    ]);
    self.chooseField = ko.observable("name");
    self.searchText = ko.observable();

    self.search = function () {
        var result = [];
        self.items().forEach(function (item) {
            $.each(item, function (key, val) {
                if (key == self.chooseField() && val.toLowerCase().indexOf(self.searchText().toLowerCase()) == 0) {
                    result.push(item);
                }
            });
        });
        self.filteredItems(result);
    };

    // sort
    self.activeSort = ko.observable(self.searchFields()[0]);

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
        self.filteredItems.sort(sortFunction);
    };

}

function CustomerAIViewModel(data) {
    if (!data) {
        data = {};
    }
    var self = this;
    self.customers = ExtractModels(self, data.customers, AIViewModel);
    var filters = [
		{
		    Type: "text",
		    Name: "Name",
		    Value: ko.observable(""),
		    RecordValue: function (record) { return record.name; }
		}
    ];
    self.filter = new FilterModel(filters, self.customers);
}

function FilterModel(filters, records) {
    var self = this;
    self.records = GetObservableArray(records);
    self.filters = ko.observableArray(filters);
    self.activeFilters = ko.computed(function () {
        var filters = self.filters();
        var activeFilters = [];
        for (var index = 0; index < filters.length; index++) {
            var filter = filters[index];
            if (filter.CurrentOption) {
                var filterOption = filter.CurrentOption();
                if (filterOption && filterOption.FilterValue != null) {
                    var activeFilter = {
                        Filter: filter,
                        IsFiltered: function (filter, record) {
                            var filterOption = filter.CurrentOption();
                            if (!filterOption) {
                                return;
                            }
                            var recordValue = filter.RecordValue(record);
                            return recordValue != filterOption.FilterValue; NoMat
                        }
                    };
                    activeFilters.push(activeFilter);
                }
            }
            else if (filter.Value) {
                var filterValue = filter.Value();
                if (filterValue && filterValue != "") {
                    var activeFilter = {
                        Filter: filter,
                        IsFiltered: function (filter, record) {
                            var filterValue = filter.Value();
                            filterValue = filterValue.toUpperCase();
                            var recordValue = filter.RecordValue(record);
                            recordValue = recordValue.toUpperCase();
                            return recordValue.indexOf(filterValue) == -1;
                        }
                    };
                    activeFilters.push(activeFilter);
                }
            }
        }
        return activeFilters;
    });
    self.filteredRecords = ko.computed(function () {
        var records = self.records();
        var filters = self.activeFilters();
        if (filters.length == 0) {
            return records;
        }
        var filteredRecords = [];
        for (var rIndex = 0; rIndex < records.length; rIndex++) {
            var isIncluded = true;
            var record = records[rIndex];
            for (var fIndex = 0; fIndex < filters.length; fIndex++) {
                var filter = filters[fIndex];
                var isFiltered = filter.IsFiltered(filter.Filter, record);
                if (isFiltered) {
                    isIncluded = false;
                    break;
                }
            }
            if (isIncluded) {
                filteredRecords.push(record);
            }
        }
        return filteredRecords;
    }).extend({ throttle: 200 });
}

function ExtractModels(parent, data, constructor) {
    var models = [];
    if (data == null) {
        return models;
    }
    for (var index = 0; index < data.length; index++) {
        var row = data[index];
        var model = new constructor(row, parent);
        models.push(model);
    }
    return models;
}

function GetObservableArray(array) {
    if (typeof (array) == 'function') {
        return array;
    }
    return ko.observableArray(array);
}

var testCustomers = [
    {
        name: "Test 1",
        description: "None"
    },
    {
        name: "Another Customer",
        description: "Recently Modified"
    },
    {
        name: "Third Largest",
        description: "New"
    },
    {
        name: "Fourth in Line",
        description: "New"
    },
    {
        name: "5 for 5",
        description: "None"
    },
    {
        name: "Six",
        description: "New"
    },
    {
        name: "Serpent",
        description: "Recently Modified"
    }
];
var testData = {
    customers: testCustomers
};
//ko.applyBindings(CustomerAIViewModel(testData));


    //self.orders = ko.observableArray([]);

    //$.getJSON("http://www.json-generator.com/j/bURkdTjlrC?indent=4", function (data) {
    //    $.each(data, function (index, dataObject) {
    //        var price = Number(dataObject.Price.replace(/[^0-9\.]+/g, ""));
    //        dataObject.PricePerLine = (price * dataObject.Quantity).toFixed(2) + "$";
    //    });
    //    self.orders(data);
    //});
    //};



app.addViewModel({
    name: "AI",
    bindingMemberName: "ai",
    factory: AIViewModel,
    navigatorFactory: function (app) {
        return function () {
            app.errors.removeAll();
            app.user(null);
            app.view(app.Views.AI);
        };
    }
});