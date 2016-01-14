'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
   indexAction(){
   	return this.listAction();
   }

   listAction() {
   	var fs = require('fs');
   	var case_root = think.RESOURCE_PATH + '/test_case/';
   	var subs = new Array;
   	if (fs.existsSync(case_root)) {
   		var cases = fs.readdirSync(case_root);
   		var stat;
   		for(var i in cases) {
   			var item = {"name":"","type":""};
   			stat = fs.statSync(case_root + cases[i]);
   			if (stat.isDirectory()) { 
   				item.name = cases[i];
   				item.type = "package";
   			} else {
   				item.name = cases[i];
   				item.type = "case";
   			}
   			subs.push(item);
   		}
   	}
   	this.http.json(subs);
   }

   showAction() {

   }

   addAction() {

   }

   removeAction() {

   }

   renameAction() {

   }
}