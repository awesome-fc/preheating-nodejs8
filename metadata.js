module.exports = {
  name: 'preheating-nodejs8',
  description: 'Preheating instances',
  userPrompt: [
    {
      type: 'confirm',
      name: 'http',
      message: '需要预热的函数是否通过 Http 触发器触发？'
    },
    {
      type: 'input',
      name: 'targetServiceName',
      message: '请输入需要预热的函数所在的服务名称？（不填表示与预热函数相同）'
    },
    {
      type: 'input',
      name: 'targetQualifier',
      message: '请输入需要预热的函数所在的服务版本？',
      'default': 'LATEST'
    },
    {
      type: 'input',
      name: 'targetFunctionName',
      message: '请输入需要预热的函数名称？（多个函数用逗号分隔）'
    },
    {
      type: 'number',
      name: 'preheatingNumber',
      message: '请输入需要预热的实例个数？',
      validate: (input, answers) => {
        if (input <= 0) {
          return '必须大于零';
        }
        answers.event = { preheatingNumber: parseInt(input), targets: [] };
        const functions = answers.targetFunctionName.split(',');
        for (const f of functions) {
          const target = { qualifier: answers.targetQualifier, functionName: f, http: answers.http };
          if (answers.targetServiceName) {
            target.serviceName = answers.targetServiceName;
          }
          answers.event.targets.push(target);
        }
        return true;
      }
    }
  ],
  vars: {
    service: '{{ projectName }}'
  }
}