/// <reference path="../framework7/framework7.d.ts" />

import Framework7 = require('framework7');

var app: any = new Framework7();

var mainView = app.addView('.view-main', {
    dynamicNavbar: true
});
