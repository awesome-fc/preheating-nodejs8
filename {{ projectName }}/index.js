'use strict';

const FCClient = require('@alicloud/fc2');

let client;

module.exports.initializer = function(context, callback) {
  client = new FCClient(context.accountId, {
    accessKeyID: context.credentials.accessKeyId,
    accessKeySecret: context.credentials.accessKeySecret,
    securityToken: context.credentials.securityToken,
    region: context.region
  });
  callback(null, ''); 
};

module.exports.handler = async (event, context, callback) => {
  const e = JSON.parse(event);
  let preheatingNumber = e.preheatingNumber;
  const targets = e.targets;

  if (typeof preheatingNumber !== 'number' || preheatingNumber <= 0) {
    callback(new Error('The preheatingNumber must be greater than 0.'))
  }
  if (!targets || !(targets instanceof Array)) {
    callback(new Error('The target are required and are arrays.'));
  }
  const futures = [];
  while(preheatingNumber--) {
    for(const target of targets) {
      const serviceName = target.serviceName || context.service.name;
      const qualifier = target.qualifier || context.service.qualifier;
      const functionName = typeof target === 'string' ? target : target.functionName;
      if (target.http) {
        const method = target.method || 'GET';
        const path = `/proxy/${serviceName}${qualifier === 'LATEST' ? '' : `.${qualifier}`}/${functionName}/`;
        const query = target.query;
        const body = target.body;
        const header = target.header;
        const future = client.request(method, path, query, body, header);
        futures.push(future);
      } else {
        const event = target.event || {}
        event.preheating = ture;
        const future = client.invokeFunction(serviceName, functionName, event, { 'x-preheating': true }, qualifier );
        futures.push(future);
      }
    }
  }
  try {
    await Promise.all(futures);
    console.log('Preheating is success.');
    callback(null, 'Preheating is success.'); 
  } catch (err) {
    console.error('Preheating is failure.');
    callback(err);
  }
};