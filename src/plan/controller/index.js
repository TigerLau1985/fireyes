'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(self){
    //auto render template file index_index.html
    this.action('index','list').then(function(data) {
    	self.plans = data;
    	return self.display();
	});
  }

  async listAction() {
    let plans = [];
    try {
    	let model = this.model("plan");
    	let data = await model.field(["name"]).select();   	
    	for (var i in data) {
    		if (data[i].name) plans.push(data[i].name);
    	}
    } catch(err) {
    }

    return plans;
  }
}