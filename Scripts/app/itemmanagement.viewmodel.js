function ItemManagementViewModel(app, dataModel) {
    var self = this;
    self.message = ko.observable("Item management tab is under construction...");
}

app.addViewModel({
    name: "ItemManagement",
    bindingMemberName: "itemmanagement",
    factory: ItemManagementViewModel
});