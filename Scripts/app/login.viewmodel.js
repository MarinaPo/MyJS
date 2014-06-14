function LoginViewModel(app, dataModel) {
    // Private state
    var self = this;
    
    // Data
    self.userName = ko.observable("").extend({
        required: { message: "Please enter user name" }
    });
    self.password = ko.observable("").extend({
         required: { message: "Please enter password" }
    });
    self.rememberMe = ko.observable(false);
    self.validationErrors = ko.validation.group([self.userName, self.password]);

    // Other UI state
    self.errors = ko.observableArray();
    self.loggingIn = ko.observable(false);
    
    // Operations
    self.login = function () {
        self.errors.removeAll();

        if (self.validationErrors().length > 0) {
            self.validationErrors.showAllMessages();
            return;
        }

        self.loggingIn(true);

        dataModel.login({
            grant_type: "password",
            username: self.userName(),
            password: self.password()
        }).done(function (data) {
            self.loggingIn(false);

            if (data.userName && data.access_token) {
                app.navigateToLoggedIn(data.userName, data.role, data.access_token, self.rememberMe());
            } else {
                self.errors.push("An unknown error occurred.");
            }
        }).failJSON(function (data) {
            self.loggingIn(false);

            if (data && data.error_description) {
                self.errors.push(data.error_description);
            } else {
                self.errors.push("An unknown error occurred.");
            }
        });
    };
}

app.addViewModel({
    name: "Login",
    bindingMemberName: "login",
    factory: LoginViewModel,
    navigatorFactory: function (app) {
        return function () {
            app.errors.removeAll();
            app.user(null);
            app.view(app.Views.Login);
        };
    }
});
