'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }

  createAction() {
  	let pkg = this.param('package');
  	let name = this.param('name');

  	let path = this.config('case_root');
  	let fs = requier('fs');
  	if (fs.existsSync(path+pkg)) {

  	}
  }

  validatAction() {

  }

  removeAction() {

  }

  renameAction() {

  }

  editAction() {

  }

  readAction() {
  	let name = this.param('case');
  	let path = this.config('case_root') + name;
  	let fs = require('fs');
  	let content = '不能打开指定的测试用例';
  	if (fs.existsSync(path)) {
  		content = JSON.stringify(this.readCase(path));
  	}
  	this.end(content);
  }

  async sleep(timeout) {
	  return new Promise((resolve, reject) => {
	    setTimeout(function() {
	      resolve();
	    }, timeout);
	  });
	}

  async runAction() {
  	let rlt = 'none';
  	let name = this.param('case');
	  let plan = this.param('plan');
	  let model = this.model('callback');
  	try {
	  	if (name) {
	  		let cs = this.readCase(this.config('case_root') + name);
	  		let step = cs.begin;
	  		let res;
	  		let pre;
	  		while(step) {
		  		res = await this.executeCase(step);
		  		pre = step;
		  		step = null;
          think.log(res, 'run');
		  		if (res.errno) {
		  			if ('ETIMEDOUT' == res.errno) {
		  				rlt = 'timeout';
		  				if (pre.timeout) step = cs[pre.timeout];
		  			}
		  		} else {
		  			let exp;
		  			if(this.checkResponse(res, pre.response, exp)) {
		  				rlt = 'pass';
		  				if (pre.successed) step = cs[pre.successed];
		  				if (pre.callback) {
                let data = exp;
		  					data['cb'] = pre.callback;  // 将会话ID和期望的callback内容缓存到DB
		  					data['stat'] = 'timeout';
                model.add(data);
		  					await sleep(pre.callback.time * 1000);
                let stat = await model.field('stat').where(exp).find();
                switch(stat) {
                  case 'timeout':
                    step = cs[pre.callback.timeout];
                  break;
                  case 'fail':
                    step = cs[pre.callback.failed]; 
                  break;
                  case 'success':
                    step = cs[pre.callback.successed];
                  break;
                }
		  				}
		  			} else {
		  				rlt = 'fail';
		  				step = cs[pre.failed];
		  			}
		  		}
		  	}
		  } 
	  } catch(e) {
      think.log(e, 'run');
	  	rlt = 'except';
	  }

	  if (!plan) {
	  	this.end(rlt);
	  } else {
	  	return rlt;
	  }
  }

  readCase(path) {
  	let fs = require('fs');
  	let content = fs.readFileSync(path);
  	let cs = JSON.parse(content);
  	return cs;
  }

  checkResponse(res, expert, exp) {
  	if (!expert) { return true; }

    if (expert.root) {
      res = res[expert.root];
      if(!res) return false;
    }

    think.log(res, 'check');
    think.log(expert, 'check');

    if (expert.session) {
      if (res.hasOwnProperty(expert.session)) {
        let ex;
        ex[expert.session] = res[expert.session];
        exp = ex;
      } else {
        return false;
      }
    }

  	if (expert.fields) {
  		let fields = expert.fields;
  		for (var i in fields) {
  			let it = fields[i];
  			if (!res[it] || (expert[it] && res[it] != expert[it])) {
  				return false;
  			}
  		}
  	}

    return true;
  }

  auth(time) {
    let str = this.config('ucpaas_account') +':' + time;
    let buf = new Buffer(str);
    return buf.toString('base64');
  }

  sig(time) {
    let str = this.config('ucpaas_account') + this.config('ucpaas_token') + time;
    let crypto = require('crypto');
    let hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex').toUpperCase();;
  }

  genReqOpt(step) {
    let time = new Date().toISOString().replace(/\..+/, '').replace(/T/, '').replace(/:/g, '').replace(/-/g,'');
    let opt = {
      method:'post',
      host:this.config('api_host'),
      port:this.config('api_port'),
      path:'/' + this.config('ucpaas_version')  + '/Accounts/' + this.config('ucpaas_account') + step.request + '?sig=' + this.sig(time),
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json;charset=utf-8',
        'Authorization':this.auth(time)
      }
    }
    return opt;
  }

  async executeCase(step) {
  	return new Promise((resolve, reject) => {	
	  	let https = require('https');
      let opt = this.genReqOpt(step);
	  	let req = https.request(opt, function(res){
	  		res.on('data', function(d){
	  			resolve(JSON.parse(d));
	  		});
        res.on('error', function(e) {
          resolve(e);
        });
	  	});
	  	req.end(JSON.stringify(step.body));

	  	req.on('error', function(e) {
	  		resolve(e);
	  	});
	  });
  }

  callbackAction(self) {
  	let sessionKey = this.config('session_key');
  	let model = this.model('callback');
  	let parseString = require('xml2js').parseString;
  	parseString(this.http.payload, { explicitArray : false, ignoreAttrs : true }, function(err, rlt){
  		if (rlt.hasOwnProperty(sessionKey)) {
  			let query = '{' + sessionKey + ':' + '\"' + rlt.sessionKey +'\"}';
  			let data = model.where(query).field("cb").find();
  			if (!think.isEmpty(data)) {
  				let stat = {stat:"success"};
  				for (let i in data) {
  					if (rlt[i] != data[i]) {
  						stat = {stat:"fail"};
  						break;
  					}
  				}
  				model.where(query).update(stat);
  			}
  		}
  	});
  }
}