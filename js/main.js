$(document).ready(function(){
    
    var newUser = $('#add-new');
    var list = $('.list-group');
    
    // Show User
    
    function showUser (users) {
        
            $('.list-group').find('.user').click(function(event) {
                event.preventDefault();
                var numberUser = $(this).attr('data-user');
                var userProp = users[numberUser];
                
                $('.search').fadeOut('slow');

                list.hide('fade', 'slow', function() {
                    $('.list-group li').remove();
                    var dataUser = '<li class="header-list"><span class="chapter">User</span><ul>';
                    for ( var key in userProp ) {
                        if ( key == 'username' || key == 'name' || key == 'email' ) {
                            dataUser += '<li class="list-group-item">' + key + '<span class="property">' + userProp[key] + '</span></li>';
                        }
                        else {
                            continue;
                        }
                    }
                    dataUser += '</ul></li><li class="header-list"><span class="chapter">Address</span><ul>';
                    for ( key in userProp ) {
                        if ( key == 'phone' || key == 'website' ) {
                            dataUser += '<li class="list-group-item">' + key + '<span class="property">' + userProp[key] + '</span></li>';
                        }
                        else if ( key == 'address' ) {
                            for ( var i in userProp[key] ) {
                                if ( i != 'geo' ) {
                                    dataUser += '<li class="list-group-item">' + i + '<span class="property">' + userProp[key][i] + '</span></li>';
                                }
                                else {
                                    for ( j in userProp[key][i] ) {
                                        dataUser += '<li class="list-group-item">geo ' + j + '<span class="property">' + userProp[key][i][j] + '</span></li>';
                                    }
                                }
                            }
                        }
                        else {
                            continue;
                        }
                    }
                    dataUser += '</ul></li><li class="header-list"><span class="chapter">Company</span><ul>';
                    for ( key in userProp ) {
                        if ( key == 'company' ) {
                            for ( var z in userProp[key] ) {
                                dataUser += '<li class="list-group-item">' + z + '<span class="property">' + userProp[key][z] + '</span></li>';
                            }
                        }
                        else {
                            continue;
                        }
                    }
                    dataUser += '</ul></li>';
                    list.append(dataUser);
                    list.show('fade', 'slow');

                }); // end hide
                
                buttonBack(users);

            }); // end click

        }
    
    // Button Back
    
    function buttonBack(users) {
        $('#add-user').fadeOut('slow', function() {
            $('#back').fadeIn('slow');
        }); // end hide
        
        $('#back').click(function() {
            $('.search').fadeIn('slow');
            list.fadeOut('slow', function() {
                $('.list-group li').remove();
                
            for( var i = 0; users.length > i; i++ ) {
                var username = users[i].username;
                if( username != undefined ) {
                    var user = '<li class="list-group-item"><a class="user" href="#" data-user="' + i + '">' + username + '</a><button type="button" class="btn btn-danger delete">Delete</button></li>';
                    list.append(user);
                }
                else {
                    continue;
                }
            } // end for
                
                $(this).fadeIn('slow');
                
                $('#back').fadeOut('slow', function() {
                    $('#add-user').fadeIn('slow');
                }); // end hide
                
                showUser(users);

                deleteUser(users);
                
            }); // end fadeOut
            
        }); // end click

    }
    
    // Delete user
    
    function deleteUser(users) {
        $('.delete').click(function() {
            var id = $(this).siblings('a').attr('data-user');
            users[id] = {};
            $(this).parent('li').remove();
        }); // end click
    }
    
    // Add new user
    
    function addUser(users, usernameArray) {
        
        newUser.dialog({
            autoOpen: false,
            width: 600,
            maxHeight: 600
        }); // end dialog

        $('#add-user').click(function(){
            newUser.dialog('open');
        }); // end click

        newUser.find('button').click(function(event) {
            event.preventDefault();
            var value, label;
            var valObj = {};
            valObj.address = {};
            valObj.company = {};
            $('#add-new input').each(function() {
                label = $(this).attr('id');
                value = $(this).val();
                if ( label == 'name' || label == 'username' || label == 'email' || label == 'phone' || label == 'website' ) {
                    valObj[label] = value;
                }
                else if ( label == 'street' || label == 'suite' || label == 'city' || label == 'zipcode' ) {
                    valObj.address[label] = value;
                }
                else if ( label == 'company-name' || label == 'company-catchPhrase' || label == 'company-bs' ) {
                    label = label.slice(8);
                    valObj.company[label] = value;
                }
            }); //end each

            var id = $('.list-group li').length;
            users.push(valObj);
            var username = valObj.username;
            usernameArray.push(username);
            var user = '<li class="list-group-item"><a class="user" href="#" data-user="' + id + '">' + username + '</a><button type="button" class="btn btn-danger delete">Delete</button></li>';
            list.prepend(user);

            newUser.dialog('close');

            $('#add-new input').val('');

            showUser(users);

            deleteUser(users);
                
        }); // end click    
    }
    
    // Search
    
    function search(users) {
        $('#search-btn').click(function(event) {
            event.preventDefault();
            var input = $('.search input').val();
            var username;
            
            $('.list-group li').each(function() {
                username = $(this).find('a').text();
                if ( input == '' ) {
                    $(this).fadeIn('slow');
                }
                else if ( input.toLowerCase() != username.toLowerCase() ) {
                    $(this).fadeOut('slow');
                }
                else {
                    $(this).fadeIn('slow');
                }
                
            });
        });
    }
    
    // Autocomplete
    
    function autoUsername(usernameArray) {
        $('#search').autocomplete({
            source: usernameArray
        });
    }
    
    // Get users
    
    $.get('https://jsonplaceholder.typicode.com/users', '', function(users) {
        
        var usernameArray = [];
        
        for( var i = 0; users.length > i; i++ ) {
            var username = users[i].username;
            usernameArray.push(username);
            var user = '<li class="list-group-item"><a class="user" href="#" data-user="' + i + '">' + username + '</a><button type="button" class="btn btn-danger delete">Delete</button></li>';
            list.append(user);
        } // end for
        
        autoUsername(usernameArray);

        showUser(users);

        deleteUser(users);

        addUser(users, usernameArray);
        
        search();

    }); // end get
    
}); // end ready