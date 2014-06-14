function RegisterViewModel(app, dataModel) {
    var self = this;
    self.actionName = ko.observable(dataModel.status());
    // Data
    self.userName = ko.observable(dataModel.user.peek().userName).extend({
        required: true,
        pattern: {
            params: /^\w+$/i,
            message: "Login Name cannot contain spaces"
        },
        maxLength: {
            params: 20,
            message: "Login Name is too long"
        }
    });
    self.firstName = ko.observable(dataModel.user.peek().firstName).extend({
        required: true,
        maxLength: {
            params: 50,
            message: "Login Name is too long"
        }
       
    });
    self.lastName = ko.observable(dataModel.user.peek().lastName).extend({
        required: true,
        maxLength: {
            params: 50,
            message: "Login Name is too long"
        },
        pattern: {
            params: /^[A-Za-z]+$/i,
            message: "First name cannot contain number"
        }
    });
    self.password = ko.observable("").extend({
        required: true,
        minLength: {
            params: 4,
            message: "Password field cannot be shorted than 4 and longer than 10 character"
        },
        maxLength: {
            params: 10,
            message: "Password field cannot be shorted than 4 and longer than 10 character"
        },
        pattern: {
            params: /^\w+$/i,
            message: "Login Name cannot contain spaces"
        }
    });
    self.confirmPassword = ko.observable("").extend({
        required: true,
        equal: self.password
    });
    
    self.email = ko.observable(dataModel.user.peek().email).extend({
        required: true,
        pattern: {
            
        }
    });

    self.regions = ko.observableArray(["North", "East", "West", "South"]);
    self.region = ko.observable(dataModel.user.peek().region).extend({
        required: true 
    });


    self.role = ko.observable(dataModel.user.peek().role).extend({
        required: true
    });

    // Other UI state
    self.registering = ko.observable(false);
    self.errors = ko.observableArray();
    self.validationErrors = ko.validation.group([self.userName, self.email, self.password, self.confirmPassword, self.firstName, self.lastName, self.region, self.role]);
    self.userNameDisabled = ko.observable(false);
    self.registerFunction;
    
    // Submit handlers logic
    if (dataModel.status() === "Update") {
        self.registerFunction = dataModel.update;
        self.userNameDisabled(true);
    } else {
        self.registerFunction = dataModel.register;
        self.userNameDisabled(false);
    }

    // Operations
    self.register = function () {
        self.errors.removeAll();
        if (self.validationErrors().length > 0) {
            self.validationErrors.showAllMessages();
            return;
        }
        self.registering(true);

        self.registerFunction({
            userName: self.userName(),
            password: self.password(),
            confirmPassword: self.confirmPassword(),
            firstName: self.firstName(),
            lastName: self.lastName(),
            email: self.email(),
            region: self.region(),
            role: self.role()
        }).done(function (data) {
            dataModel.login({
                grant_type: "password",
                username: self.userName(),
                password: self.password()
            }).done(function (data) {
                self.registering(false);

                if (data.userName && data.access_token) {
                    app.navigateToLoggedIn(data.userName, data.access_token, false /* persistent */);
                } else {
                    self.errors.push("An unknown error occurred.");
                }
            }).failJSON(function (data) {
                self.registering(false);

                if (data && data.error_description) {
                    self.errors.push(data.error_description);
                } else {
                    self.errors.push("An unknown error occurred.");
                }
            });
        }).failJSON(function (data) {
            var errors;

            self.registering(false);
            errors = dataModel.toErrorsArray(data);

            if (errors) {
                self.errors(errors);
            } else {
                self.errors.push("An unknown error occurred.");
            }
        });
    };

    self.login = function () {
        app.navigateToLogin();
    };
}

app.addViewModel({
    name: "Register",
    bindingMemberName: "register",
    factory: RegisterViewModel
});