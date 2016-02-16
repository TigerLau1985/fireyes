'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(self) {
    self.packages = this.controller('package').enumDir();
    return self.display();
  }

  showPackage(pack) {
  	return this.controller('package').showPkg(pack);
	}
}