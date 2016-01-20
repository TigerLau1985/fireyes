'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(self) {
    this.action('package','list').then(function(data) {
    	self.packages = data;
    	return self.display();
		});
  }

  showPackage(pack) {
  	return this.controller('package').showPkg(pack);
	}
}