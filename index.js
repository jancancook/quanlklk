// Create or Open Database.
var db = window.openDatabase('FGW', '1.0', 'FGW', 20000);

// To detect whether users use mobile phones horizontally or vertically.
$(window).on('orientationchange', onOrientationChange);

function onOrientationChange(e) {
    if (e.orientation == 'portrait') {
        console.log('Portrait.');
    }
    else {
        console.log('Landscape.');
    }
}

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    $(document).on('deviceready', onDeviceReady);
}
else {
    onDeviceReady();
}

// Display messages in the console.
function log(message) {
    console.log(`[${new Date()}] ${message}`);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
    log(`Errors when executing SQL query. [Code: ${error.code}] [Message: ${error.message}]`);
}

// Run this function after starting the application.
function onDeviceReady() {
    // Logging.
    log(`Device is ready.`);

    db.transaction(function (tx) {
        // Create TABLE 'ACCOUNT'
        var query = `CREATE TABLE IF NOT EXISTS Account (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Username TEXT NOT NULL UNIQUE,
                                                         Password TEXT NOT NULL)`;

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Account' successfully.`);
        }

        //CREATE TABLE 'NOTE'
        var query = `CREATE TABLE IF NOT EXISTS Note (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        CustomerID INTEGER NOT NULL,
                                                        Note TEXT NOT NULL,
                                                        FOREIGN KEY(CustomerID) REFERENCES Customer(Id))`;

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
        log(`Create table 'Note' successfully.`);
        }

        //create table type
        var query = `CREATE TABLE IF NOT EXISTS Type (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        TypeID INTEGER NOT NULL,
                                                        Type TEXT NOT NULL)`;
        //var query = "INSERT INTO Type (TypeID, Type) VALUES (? ,?)";
         
        //tx.executeSql(query, [], transactionSuccess, transactionError);   
        //tx.executeSql(query, [1, 'Apartment'], transactionSuccessForTableData('Type', 1, 'Apartment'), transactionError);
        //tx.executeSql(query, [2, 'Penthouse'], transactionSuccessForTableData('Type', 2, 'Penthouse'), transactionError);
        //tx.executeSql(query, [3, 'House'], transactionSuccessForTableData('Type', 3, 'House'), transactionError);
        //tx.executeSql(query, [4, 'Villa'], transactionSuccessForTableData('Type', 4, 'Villa'), transactionError);

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);  

        function transactionSuccess(tx, result) {
            log(`Create table 'Type' successfully.`);
            }


            //CREATE TABLE FURNITURE
        var query = `CREATE TABLE IF NOT EXISTS Furniture (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        FurnitureID INTEGER NOT NULL,
                                                        FurnitureName TEXT NOT NULL)`;

        //var query = "INSERT INTO Furniture (FurnitureID, FurnitureName) VALUES (? ,?)";
        //tx.executeSql(query, [1, 'Unfurnished'], transactionSuccessForTableData('Furniture', 1, 'Unfurnished'), transactionError);
        //tx.executeSql(query, [2, 'Half furnished'], transactionSuccessForTableData('Furniture', 2, 'Half furnished'), transactionError);
        //tx.executeSql(query, [3, 'Furnished'], transactionSuccessForTableData('Furniture', 3, 'Ffurnished'), transactionError);

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);  

        function transactionSuccess(tx, result) {
            log(`Create table 'Furniture' successfully.`);
            }

        //CREATE TABLE CUSTOMER
        var query = `CREATE TABLE IF NOT EXISTS Customer (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                            CustomerName TEXT UNIQUE NOT NULL,
                                                            Street TEXT NOT NULL,
                                                            City INTEGER NOT NULL,
                                                            District INTEGER NOT NULL,
                                                            Ward INTEGER NOT NULL,
                                                            Type INTEGER NOT NULL,
                                                            Bedroom INTEGER NOT NULL,
                                                            Price REAL NOT NULL,
                                                            Furniture INTEGER NULL,
                                                            Reporter TEXT NOT NULL)`;
                                                            // DateAdded REAL NOT NULL)`;

        tx.executeSql(query, [], transactionSuccessForTable('Property'), transactionError);

        function transactionSuccess(tx, result) {
            log(`Create table 'Customer' successfully.`);
            }

    });
    prepareDatabase(db);
}

$(document).on('pagebeforeshow', '#page-create', function() {
    importType('#page-create #frm-register');
});

$(document).on('pagebeforeshow', '#page-create', function() {
    importFurniture('#page-create #frm-register');
});


//Import Furniture
function importFurniture(form, selectedId = -1) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Furniture ORDER BY FurnitureName';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>--Select Furniture--</option>`;
            for (let item of result.rows) {
                if (selectedId == item.Id){
                    optionList += `<option value='${item.Id}' selected>${item.FurnitureName}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.FurnitureName}</option>`;
                }
                
            }

            $(`${form} #furniture`).html(optionList);
            $(`${form} #furniture`).selectmenu('refresh', true);
        }
    });
}

//Import Type
function importType(form, selectedId = -1) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Type ORDER BY Type';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>--Select Type--</option>`;
            for (let item of result.rows) {
                if (selectedId == item.Id){
                    optionList += `<option value='${item.Id}' selected>${item.Type}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Type}</option>`;
                }
                
            }

            $(`${form} #type`).html(optionList);
            $(`${form} #type`).selectmenu('refresh', true);
        }
    });
}

$(document).on('pagebeforeshow', '#page-create', function() {
    importCity('#page-create #frm-register');
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #city', function() {
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #district', function() {
    importWard('#page-create #frm-register');
});

//Import City
function importCity(form, selectedId = -1) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM City ORDER BY Name';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>--Select city--</option>`;

            for (let item of result.rows) {
                if (selectedId == item.Id) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #city`).html(optionList);
            $(`${form} #city`).selectmenu('refresh', true);
        }
    });
}

//Import District
function importDistrict(form, selectedId = -1) {
    var name = $(`${form} #city option:selected`).val(); 
    var id = $(`${form} #city`).val(); 
    db.transaction(function (tx) {
        var query = 'SELECT * FROM District WHERE CityId = ? ORDER BY Name';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>--Select District--</option>`;

            for (let item of result.rows) {
                if (selectedId == item.Id) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #district`).html(optionList);
            $(`${form} #district`).selectmenu('refresh', true);
        }
    });
}

//Import Ward
function importWard(form, selectedId = -1) {
    var name = $(`${form} #city option:selected`).val(); 
    var id = $(`${form} #district`).val(); 
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Ward WHERE DistrictId = ? ORDER BY Name';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>--Select Ward--</option>`;

            for (let item of result.rows) {
                if (selectedId == item.Id) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #ward`).html(optionList);
            $(`${form} #ward`).selectmenu('refresh', true);
        }
    });
}

// Submit a form to register a new account.
//$(document).on('submit', '#page-create #frm-register', confirmAccount);
$(document).on('submit', '#page-create #frm-register', confirmCustomer);

//function confirmAccount(e) {
  function confirmCustomer(e) {
    e.preventDefault();

    var propertyname = $('#page-create #frm-register #propertyname').val();
    var street = $('#page-create #frm-register #street').val();
    var city = $('#page-create #frm-register #city option:selected').text();
    var district = $('#page-create #frm-register #district option:selected').text();
    var ward = $('#page-create #frm-register #ward option:selected').text();
    var type = $('#page-create #frm-register #type option:selected').text();
    var furniture = $('#page-create #frm-register #furniture option:selected').text();
    var bedroom = $('#page-create #frm-register #bedroom').val();
    var price = $('#page-create #frm-register #price').val();
    var reporter = $('#page-create #frm-register #reporter').val();
    // var note = $('#page-create #frm-register #note').val();


     db.transaction(function (tx) {
         
         var query = 'SELECT * FROM Customer WHERE CustomerName = ?';
         tx.executeSql(query, [propertyname], transactionSuccess, transactionError);
         function transactionSuccess(tx, result) {
            if (result.rows[0] == null){
                $('#page-create #frm-confirm #propertyname').text(propertyname);
                $('#page-create #frm-confirm #street').text(street);
                $('#page-create #frm-confirm #city').text(city);
                $('#page-create #frm-confirm #district').text(district);
                $('#page-create #frm-confirm #ward').text(ward);
                $('#page-create #frm-confirm #type').text(type);
                $('#page-create #frm-confirm #furniture').text(furniture);
                $('#page-create #frm-confirm #bedroom').text(bedroom);
                $('#page-create #frm-confirm #price').text(price);
                $('#page-create #frm-confirm #reporter').text(reporter);
                // $('#page-create #frm-confirm #note').text(note);
                $('#page-create #frm-confirm').popup('open');
            }
            else{
             alert('Account exists.');
            } 
         }
    });
}


//$(document).on('vclick', '#btn-register-confirm', registerAccount);
$(document).on('submit', '#page-create #frm-confirm', registerCustomer);

function registerCustomer(e) {
    e.preventDefault();

    // Get user's input.
    // var username = $('#page-create #popup-register-confirm #username').text();
    // var password = $('#page-create #popup-register-confirm #password').text();
    
    var propertyname = $('#page-create #frm-register #propertyname').val();
    var street = $('#page-create #frm-register #street').val();
    var city = $('#page-create #frm-register #city option:selected').text();
    var district = $('#page-create #frm-register #district option:selected').text();
    var ward = $('#page-create #frm-register #ward option:selected').text();
    var type = $('#page-create #frm-register #type option:selected').text();
    var furniture = $('#page-create #frm-register #furniture option:selected').text();
    var bedroom = $('#page-create #frm-register #bedroom').val();
    var price = $('#page-create #frm-register #price').val();
    var reporter = $('#page-create #frm-register #reporter').val();
    //var note = $('#page-create #frm-register #note').text();
    
        db.transaction(function (tx) {
            //var query = 'INSERT INTO Account (Username, Password) VALUES (?, ?)';
            var query = 'INSERT INTO Customer (CustomerName, Street, City, District, Ward, Type, Bedroom, Price, Furniture, Reporter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            //var note = $('#page-create #frm-register #note').text();
            tx.executeSql(query, [propertyname, street, city, district, ward, type, bedroom, price, furniture, reporter], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                // Logging.
                log(`Create a username '${propertyname}' successfully.`);

                // Reset the form.
                $('#frm-register').trigger('reset');
                $('#username').focus();

                $('#page-create #frm-confirm').popup('close');
            }
        });
    
}

// Display Account List.
// $(document).on('pagebeforeshow', '#page-list', showList);

// function showList() {
//     db.transaction(function (tx) {
//         var query = 'SELECT Id, Username FROM Account';
//         tx.executeSql(query, [], transactionSuccess, transactionError);

//         function transactionSuccess(tx, result) {
//             log(`Show list of accounts successfully.`);

//             // Prepare the list of accounts.
//             var listAccount = `<ul id='list-account' data-role='listview' data-filter='true' data-filter-placeholder='Search accounts...'
//                                                      data-corners='false' class='ui-nodisc-icon ui-alt-icon'>`;
//             for (let account of result.rows) {
//                 listAccount += `<li><a data-details='{"Id" : ${account.Id}}'>
//                                     <img src='img/boyscout_logo.jpg'>
//                                     <h3>Username: ${account.Username}</h3>
//                                     <p>ID: ${account.Id}</p>
//                                 </a></li>`;
//             }
//             listAccount += `</ul>`;
            
//             // Add list to UI.
//             $('#list-account').empty().append(listAccount).listview('refresh').trigger('create');
//         }
//     });

//     showNote();
// }

//Display CustomerList
$(document).on('pagebeforeshow', '#page-list', showListCustomer);

function showListCustomer() {
    db.transaction(function (tx) { 
        var query = 'SELECT * FROM Customer';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of customer successfully.`);

            // Prepare the list of Customer.
            var listCustomer = `<ul id='list-customer' data-role='listview' data-filter='true' data-filter-placeholder='Search accounts...'
                                    data-corners='false' class='ui-nodisc-icon ui-alt-icon'>`;
            
            for (let customer of result.rows) {
                listCustomer += `<li><a data-details='{"Id" : ${customer.Id}'>
                                    <img src='img/hotel.jpg'>
                                    <h3>Customer Name: ${customer.CustomerName}</h3>
                                    <p>${customer.City}</p>
                                    <p>Bedroom: ${customer.Bedroom}</p>
                                    <p>Type: ${customer.Type}</p>
                                    <p>Price: ${customer.Price}</p>
                                </a></li>`;
            }
            listCustomer += `</ul>`;
            // Add list to UI.
            $('#list-customer').empty().append(listCustomer).listview('refresh').trigger('create');
        }
    });
    showNote();
}


// Save Account Id.
// $(document).on('vclick', '#list-account li a', function (e) {
//     e.preventDefault();

//     var id = $(this).data('details').Id;
//     localStorage.setItem('currentAccountId', id);

//     $.mobile.navigate('#page-detail', { transition: 'none' });
// });

//// Save Customer Id.
$(document).on('vclick', '#list-customer li a', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('currentCustomerId', id);
    $.mobile.navigate('#page-detail', { transition: 'none' });

});
// Show Account Details.
// $(document).on('pagebeforeshow', '#page-detail', showDetail);

// function showDetail() {
//     var id = localStorage.getItem('currentAccountId');

//     db.transaction(function (tx) {
//         var query = 'SELECT * FROM Account WHERE Id = ?';
//         tx.executeSql(query, [id], transactionSuccess, transactionError);

//         function transactionSuccess(tx, result) {
//             var errorMessage = 'Account not found.';
//             var username = errorMessage;
//             var password = errorMessage;

//             if (result.rows[0] != null) {
//                 username = result.rows[0].Username;
//                 password = result.rows[0].Password;
//             }
//             else {
//                 log(errorMessage);

//                 $('#page-detail #btn-update').addClass('ui-disabled');
//                 $('#page-detail #btn-delete-confirm').addClass('ui-disabled');
//             }

//             $('#page-detail #id').text(id);
//             $('#page-detail #username').text(username);
//             $('#page-detail #password').text(password);
//         }
//     });
// }

$(document).on('pagebeforeshow', '#page-detail', showDetailCustomer);

function showDetailCustomer() {
    var id = localStorage.getItem('currentCustomerId');

    db.transaction(function (tx) {
        var query = 'SELECT * FROM Customer WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var errorMessage = 'Customer dose not existed.';
            var propertyname = errorMessage;
            var street = errorMessage;
            var city = errorMessage;
            var district = errorMessage;
            var ward = errorMessage;
            var type = errorMessage;
            var furniture = errorMessage;
            var bedroom = errorMessage;
            var price = errorMessage;
            var reporter = errorMessage;

            if (result.rows[0] != null) {
                propertyname = result.rows[0].CustomerName;
                street = result.rows[0].Street;
                city = result.rows[0].City;
                district = result.rows[0].District;
                ward = result.rows[0].Ward;
                type = result.rows[0].Type;
                furniture = result.rows[0].Furniture;
                bedroom = result.rows[0].Bedroom;
                price = result.rows[0].Price;
                reporter = result.rows[0].Reporter;
            }
            else {
                log(errorMessage);

                $('#page-detail #btn-update').addClass('ui-disabled');
                $('#page-detail #btn-delete-confirm').addClass('ui-disabled');
            }

            $('#page-detail #id').text(id);
            $('#page-detail #customername').text(propertyname);
            $('#page-detail #street').text(street);
            $('#page-detail #ward').text(ward);
            $('#page-detail #district').text(district);
            $('#page-detail #city').text(city);
            $('#page-detail #type').text(type);
            $('#page-detail #furniture').text(furniture);
            $('#page-detail #bedroom').text(bedroom);
            $('#page-detail #price').text(price);
            $('#page-detail #reporter').text(reporter);
        }
    });
}

// Delete Account.
$(document).on('vclick', '#page-detail #btn-delete', deleteAccount);

function deleteAccount() {
    var id = localStorage.getItem('currentAccountId');

    db.transaction(function (tx) {
        var query = 'DELETE FROM Account WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Delete account '${id}' successfully.`);

            $.mobile.navigate('#page-list', { transition: 'none' });
        }
    });
}

$(document).on('vclick', '#page-detail #btn-note', addNote);

function addNote() {
    var id = localStorage.getItem('currentAccountId');
    var note = $('#page-detail #popup-note #txt-note').val();

    db.transaction(function (tx) {
        var query = 'INSERT INTO Note (AccountId, Note) VALUES(?, ?)';
        tx.executeSql(query, [id, note], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Create note for account '${id}' successfully.`);
            showNote();
            $('#page-detail #popup-note #txt-note').val('');
            $('#page-detail #popup-note').popup('close');
        }
    });
}

function showNote() {
    var id = localStorage.getItem('currentAccountId');

    db.transaction(function (tx) {
        var query = 'SELECT * FROM Note WHERE AccountId = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of Notes successfully.`);

            var listNote = `<ul id='list-note' data-role='listview'`;
            for (let note of result.rows) {
                listNote += `<li>${note.Note}</li>`;
            }
            listNote += `</ul>`;
            
            // Add list to UI.
            $('#list-note').empty().append(listNote).listview('refresh').trigger('create');
        }
    });
}

