import ContentController = require('../controllers/contentController');
import EntranceController = require('../controllers/entranceController');
import HomeController = require('../controllers/homeController');
import MenuController = require('../controllers/menuController');
import angular = require('angular');
import servicesModule = require('./servicesModule');

require('ionic-angular');

var m = angular.module('feedpon.controllers', [
        servicesModule.name,
        'ionic'
    ])
    .controller('ContentController', ContentController)
    .controller('EntranceController', EntranceController)
    .controller('MenuController', MenuController)
    .controller('HomeController', HomeController);

export = m;
